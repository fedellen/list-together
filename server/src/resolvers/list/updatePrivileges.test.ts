import { UserToList } from '../../entities';
import {
  userWithList,
  createUserWithSharedPriv
} from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const updatePrivilegesMutation = `
  mutation UpdatePrivileges($data: UpdatePrivilegesInput!) {
    updatePrivileges (data: $data) {
      userToList {
        listId
        sharedUsers {
          shared
          email
          privileges
        }
      }
      ${fieldErrorFragment}
    }
  }
`;

describe('Update Privileges mutation:', () => {
  it('Owner of the list can update privileges of shared users', async () => {
    const user = await userWithList();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id }
    });

    const listId = userToListTable!.listId;
    const sharedUser = await createUserWithSharedPriv(listId, 'strike');
    const sharedUserToListTable = await UserToList.findOne({
      where: { userId: sharedUser.id }
    });

    expect(sharedUserToListTable!.privileges).toBe('strike');

    const newPrivileges = 'delete';
    const updatePrivilegesInput = {
      email: sharedUser.email,
      listId: listId,
      privileges: newPrivileges
    };

    const response = await graphqlCall({
      source: updatePrivilegesMutation,
      variableValues: { data: updatePrivilegesInput },
      userId: user.id
    });

    console.log(JSON.stringify(response, null, 4));
    // Owner's response contain's info about sharedUsers
    expect(response).toMatchObject({
      data: {
        updatePrivileges: {
          userToList: [
            {
              listId: listId,
              sharedUsers: [
                {
                  shared: true,
                  email: sharedUser.email,
                  privileges: newPrivileges
                }
              ]
            }
          ]
        }
      }
    });

    const sharedUserListTableInDatabase = await UserToList.findOne({
      where: { listId: listId, userId: sharedUser.id }
    });
    expect(sharedUserListTableInDatabase!.privileges).toBe('delete');
  });

  it('Non-owners cannot update privileges on the list', async () => {
    const user = await userWithList();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id }
    });

    const listId = userToListTable!.listId;
    const initialPrivileges = 'add';
    const sharedUser = await createUserWithSharedPriv(
      listId,
      initialPrivileges
    );
    const sharedUserToListTable = await UserToList.findOne({
      where: { userId: sharedUser.id }
    });

    expect(sharedUserToListTable!.privileges).toBe(initialPrivileges);

    const updatePrivilegesInput = {
      email: sharedUser.email,
      listId: listId,
      privileges: 'delete'
    };

    const response = await graphqlCall({
      source: updatePrivilegesMutation,
      variableValues: { data: updatePrivilegesInput },
      userId: sharedUser.id
    });

    // Owner's response contain's info about sharedUsers
    expect(response).toMatchObject({
      data: {
        updatePrivileges: {
          errors: [
            {
              field: 'privileges',
              message: 'User does not have the correct "owner" privilege..'
            }
          ]
        }
      }
    });

    const sharedUserListTableInDatabase = await UserToList.findOne({
      where: { listId: listId, userId: sharedUser.id }
    });
    expect(sharedUserListTableInDatabase!.privileges).toBe(initialPrivileges);
  });
});
