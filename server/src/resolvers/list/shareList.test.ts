import { UserToList, UserPrivileges } from '../../entities';
import {
  userWithList,
  createUser,
  createUserWithSharedPriv
} from '../../test-helpers/createUser';
import { fieldErrorFragment } from '../../test-helpers/fragments/fieldErrorFragment';
import { graphqlCall } from '../../test-helpers/graphqlCall';

const shareListMutation = `
  mutation ShareList($data: ShareListInput!) {
    shareList (data: $data) {
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

describe('Share list mutation:', () => {
  it('Owner of the list can share the list', async () => {
    const user = await userWithList();
    const userToShare = await createUser();
    const userToListTable = await UserToList.findOne({
      where: { userId: user.id }
    });
    const privilegeToShare: UserPrivileges = 'strike';

    const shareListInput = {
      email: userToShare.email,
      listId: userToListTable!.listId,
      privileges: privilegeToShare
    };

    const response = await graphqlCall({
      source: shareListMutation,
      variableValues: { data: shareListInput },
      userId: user.id
    });

    // Owner's response contains info about sharedUsers
    expect(response).toMatchObject({
      data: {
        shareList: {
          userToList: [
            {
              listId: userToListTable!.listId,
              sharedUsers: [
                {
                  shared: true,
                  email: userToShare.email,
                  privileges: privilegeToShare
                }
              ]
            }
          ]
        }
      }
    });

    const sharedUserListTable = await UserToList.findOne({
      where: { listId: userToListTable!.listId, userId: userToShare.id }
    });
    expect(sharedUserListTable).toBeDefined();
    expect(sharedUserListTable?.privileges).toBe('strike');
  });

  it('Non-owners cannot share the list', async () => {
    const listOwner = await userWithList();
    const userToListTable = await UserToList.findOne({
      where: { userId: listOwner.id }
    });
    const sharedUser = await createUserWithSharedPriv(
      userToListTable!.listId,
      'strike'
    );
    const userToShare = await createUser();

    const shareListInput = {
      email: userToShare.email,
      listId: userToListTable!.listId,
      privileges: 'delete'
    };

    const response = await graphqlCall({
      source: shareListMutation,
      variableValues: { data: shareListInput },
      userId: sharedUser.id
    });

    expect(response).toMatchObject({
      data: {
        shareList: {
          errors: [
            {
              message: 'User does not have the correct "delete" privilege..'
            }
          ]
        }
      }
    });

    // New connection in database should not exist 👎
    const userToShareListConnection = await UserToList.findOne({
      where: { userId: userToShare.id }
    });
    expect(userToShareListConnection).toBeUndefined();
  });
});
