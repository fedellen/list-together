import { User, UserToList } from '../entities';
import { graphqlCall } from '../test-helpers/graphqlCall';
import { redis } from '../redis';
import faker from 'faker';
import { createConfirmationUrl } from '../utils/confirmationUrl';
import { createUser } from '../test-helpers/createUser';
import { v4 } from 'uuid';
import { forgetPasswordPrefix } from '../constants';
import { userFragment } from '../test-helpers/fragments/userFragment';

const createUserMutation = `
mutation CreateUser($data: CreateUserInput!) {
  createUser(
    data: $data
  ) ${userFragment}
}
`;

const confirmUserMutation = `
mutation ConfirmUser($token: String!) {
  confirmUser(
    token: $token
  ) 
}
`;

const loginUserMutation = `
mutation LoginUser($data: LoginUserInput!) {
  login(
    data: $data
  ) ${userFragment}
}
`;

const forgotPasswordMutation = `
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
`;

const changePasswordMutation = `
mutation ChangePassword($data: ChangePasswordInput!) {
  changePassword(data: $data) ${userFragment}
}
`;

// const logoutMutation = `
//   mutation {
//     logout
//   }
// `;

describe('createUser Mutation:', () => {
  it('can create a user with valid credentials', async () => {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    const response = await graphqlCall({
      source: createUserMutation,
      variableValues: {
        data: {
          username: user.username,
          email: user.email,
          password: user.password
        }
      }
    });

    // Check response format
    console.log(JSON.stringify(response, null, 4));
    expect(response.data?.createUser.user.username).toBe(user.username);
    expect(response.data?.createUser.user.email).toBe(user.email);
    expect(response.errors).toBeUndefined();

    // Check database entry
    const userInDatabase = await User.findOne({ where: { email: user.email } });
    expect(userInDatabase).toBeDefined();
    expect(userInDatabase!.confirmed).toBeFalsy();
    expect(userInDatabase!.email).toBe(user.email);
  });

  it('returns validation error with invalid email credentials', async () => {
    const user = {
      username: faker.internet.userName(),
      email: 'notAnEmailAddress.fake',
      password: faker.internet.password()
    };

    const response = await graphqlCall({
      source: createUserMutation,
      variableValues: {
        data: user
      }
    });

    // Check response format
    expect(response).toMatchObject({
      data: {
        createUser: {
          errors: [
            {
              field: 'email',
              message: 'Invalid email..'
            }
          ]
        }
      }
    });

    // Check for database entry
    const userInDatabase = await User.findOne({ where: { email: user.email } });
    expect(userInDatabase).toBeUndefined();
  });
});

describe('the confirmUser mutation:', () => {
  it('User can confirm account with the token created from the createConfirmationUrl function', async () => {
    const user = await createUser(false);
    // createUser(false) returns unconfirmed user
    expect(user.confirmed).toBeFalsy();
    const url = await createConfirmationUrl(user.id);
    const token = url.substr(url.length - 36);

    const response = await graphqlCall({
      source: confirmUserMutation,
      variableValues: {
        token: token
      }
    });

    expect(response).toMatchObject({
      data: {
        confirmUser: true
      }
    });

    // Refetch the user from database
    const userInDatabase = await User.findOne({ where: { id: user.id } });
    expect(userInDatabase!.confirmed).toBeTruthy();
  });

  it('User cannot confirm account with a fake uuid token', async () => {
    const user = await createUser(false);
    // createUser(false) returns unconfirmed user
    expect(user.confirmed).toBeFalsy();
    await createConfirmationUrl(user.id);
    // Create fake `uuid v4` token
    const token = v4();

    const response = await graphqlCall({
      source: confirmUserMutation,
      variableValues: {
        token: token
      }
    });

    expect(response).toMatchObject({
      data: {
        confirmUser: false
      }
    });

    // Refetch the user from database
    const userInDatabase = await User.findOne({ where: { id: user.id } });
    expect(userInDatabase!.confirmed).toBeFalsy();
  });
});

describe('Login mutation:', () => {
  it('Confirmed user can login with the correct credentials, and receives fresh empty list upon first login', async () => {
    const user = await createUser();

    const userToListTables = await UserToList.find({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });

    // No list connections on fresh user
    expect(userToListTables).toHaveLength(0);

    const response = await graphqlCall({
      source: loginUserMutation,
      variableValues: {
        data: {
          email: user.email,
          password: user.password
        }
      }
    });

    expect(response.data?.login.user.username).toBe(user.username);
    expect(response.errors).toBeUndefined();
    // New UserToList connection has 'my-list'
    const userToListTablesAfter = await UserToList.find({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });

    expect(userToListTablesAfter).toHaveLength(1);
    expect(
      userToListTablesAfter.map((table) => table.list.title).includes('my-list')
    ).toBeTruthy();
  });

  it('Confirmed user cannot login with incorrect credentials', async () => {
    const user = await createUser();
    const response = await graphqlCall({
      source: loginUserMutation,
      variableValues: {
        data: {
          email: user.email,
          password: 'wrongPassword'
        }
      }
    });

    expect(response).toMatchObject({
      data: {
        login: {
          errors: [
            {
              field: 'password',
              message: 'Password is incorrect..'
            }
          ]
        }
      }
    });
  });

  it('Unconfirmed user cannot login, response contains `Email has not been confirmed..`', async () => {
    const user = await createUser(false);
    // createUser(false) returns unconfirmed user
    const response = await graphqlCall({
      source: loginUserMutation,
      variableValues: {
        data: {
          email: user.email,
          password: user.password
        }
      }
    });

    // New UserToList connection has 'my-list'
    expect(response).toMatchObject({
      data: {
        login: {
          errors: [
            {
              field: 'email',
              message: 'Email address has not been confirmed..'
            }
          ]
        }
      }
    });
  });
});

describe('Forgot password mutation:', () => {
  it('Returns true when user is found, after sendEmail function has run', async () => {
    const user = await createUser();

    const response = await graphqlCall({
      source: forgotPasswordMutation,
      variableValues: {
        email: user.email
      }
    });
    console.log(JSON.stringify(response, null, 4));

    expect(response).toMatchObject({
      data: {
        forgotPassword: true
      }
    });
  });

  it('Returns false when user is not found', async () => {
    await createUser();

    const response = await graphqlCall({
      source: forgotPasswordMutation,
      variableValues: {
        email: 'notInTheDatabase@fake.net'
      }
    });

    expect(response).toMatchObject({
      data: {
        forgotPassword: false
      }
    });
  });
});

describe('Change password mutation:', () => {
  it('User can change password with correct redis token; returns correct user credentials', async () => {
    const user = await createUser();

    // Create forgetPassword token and save to redis
    const token = v4();
    await redis.set(forgetPasswordPrefix + token, user.id, 'ex', 60 * 60 * 24);

    const response = await graphqlCall({
      source: changePasswordMutation,
      variableValues: {
        data: { token: token, password: faker.internet.password() }
      }
    });

    expect(response).toMatchObject({
      data: {
        changePassword: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        }
      }
    });
  });

  it('User cannot change password with fake redis token; returns null', async () => {
    const user = await createUser();

    // Create forgetPassword token and save to redis
    const token = v4();
    await redis.set(forgetPasswordPrefix + token, user.id, 'ex', 60 * 60 * 24);

    const fakeToken = v4();

    const response = await graphqlCall({
      source: changePasswordMutation,
      variableValues: {
        data: { token: fakeToken, password: faker.internet.password() }
      }
    });

    expect(response).toMatchObject({
      data: {
        changePassword: {
          errors: [
            {
              field: 'token',
              message: 'No token was found..'
            }
          ]
        }
      }
    });
  });
});

// // Logout is working via manual testing
// // Can't seem to get ctx.req.session to run with Jest yet

// describe('Logout mutation:', () => {
//   it('Logged in user can log out', async () => {
//     const user = await createUser();

//     const response = await graphqlCall({
//       source: logoutMutation,
//       userId: user.id
//     });

//     console.log(response);
//   });
// });
