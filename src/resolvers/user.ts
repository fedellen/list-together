import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';

import { redis } from '../redis';
import { confirmUserPrefix, forgetPasswordPrefix } from '../constants';

import { v4 } from 'uuid';
import argon2 from 'argon2';

import { logger } from '../middleware/logger';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmationUrl } from '../utils/confirmationUrl';

import { validateCreateUser } from './types/validators/validateCreateUser';
import { validateLogin } from './types/validators/validateLogin';

import { CreateUserInput } from './types/input/CreateUserInput';
import { LoginUserInput } from './types/input/LoginUserInput';
import { ChangePasswordInput } from './types/input/ChangePasswordInput';

import { List, User, UserToList } from '../entities';
import { UserResponse } from './types/response/UserResponse';
import { MyContext } from '../MyContext';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(logger)
  async getUser(@Ctx() { req }: MyContext): Promise<User | null> {
    // Not logged in
    if (!req.session.userId) return null;

    const user = await User.findOne(req.session.userId);
    // User not found..
    if (!user) return null;

    return user;
  }

  // Create a User
  @UseMiddleware(logger)
  @Mutation(() => UserResponse)
  async createUser(@Arg('data') data: CreateUserInput): Promise<UserResponse> {
    const errors = await validateCreateUser(data);
    if (errors) return { errors };

    const hashedPassword = await argon2.hash(data.password);
    const user = await User.create({
      username: data.username,
      email: data.email,
      password: hashedPassword
    }).save();

    console.log('we are here in donde');

    await sendEmail(user.email, await createConfirmationUrl(user.id));

    console.log('we are here after donde');

    return { user };
  }

  // Confirm the user -- Probably refactor this to an express route
  @UseMiddleware(logger)
  @Mutation(() => Boolean)
  async confirmUser(@Arg('token') token: string): Promise<boolean> {
    const userId = await redis.get(confirmUserPrefix + token);

    if (!userId) {
      return false;
    }

    await User.update({ id: userId }, { confirmed: true });
    await redis.del(confirmUserPrefix + token);

    return true;
  }

  @UseMiddleware(logger)
  @Mutation(() => UserResponse)
  async login(
    @Arg('data') data: LoginUserInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: { email: data.email },
      relations: ['listConnection']
    });

    const errors = await validateLogin(data, user);
    if (errors) return { errors };
    // User will exist if no errors from validation

    ctx.req.session.userId = user!.id;

    // Initialize a new list if user contains no lists
    if (!user!.listConnection || !user!.listConnection.length) {
      const list = await List.create({
        title: 'my-list'
      }).save();
      await UserToList.create({
        listId: list.id,
        userId: user!.id,
        privileges: ['owner'] // Only list creator has owner rights
      }).save();
    }

    return { user };
  }

  // Forgot password -- Probably refactor this to an express route from email
  @UseMiddleware(logger)
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) return false;

    const token = v4(); // Token to send
    await redis.set(forgetPasswordPrefix + token, user.id, 'ex', 60 * 60 * 24); // 1 day expiration

    await sendEmail(
      email,
      // Hard coded value -- change later
      `http://localhost:3000/user/change-password/${token}`
    );

    return true;
  }

  // Change password with token from email
  @UseMiddleware(logger)
  @Mutation(() => UserResponse, { nullable: true })
  async changePassword(
    @Arg('data') { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const userId = await redis.get(forgetPasswordPrefix + token);
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'No token was found..'
          }
        ]
      };
    }

    const user = await User.findOne(userId);
    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'No user was found..'
          }
        ]
      };
    }
    await redis.del(forgetPasswordPrefix + token);

    user.password = await argon2.hash(password);
    await user.save();

    ctx.req.session.userId = user.id;

    return { user };
  }

  // Logout user
  @UseMiddleware(/*isAuth,*/ logger) // Auth errors on logout
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    return new Promise((resolve) =>
      ctx.req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return resolve(false);
        }

        ctx.res.clearCookie(process.env.COOKIE_NAME);
        return resolve(true);
      })
    );
  }
}
