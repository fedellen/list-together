import { List, User, UserToList } from '../entities';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import argon2 from 'argon2';
import { CreateUserInput } from './types/input/CreateUserInput';
import { MyContext } from '../MyContext';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmationUrl } from '../utils/confirmationUrl';
import { redis } from '../redis';
import { v4 } from 'uuid';
import { confirmUserPrefix, forgetPasswordPrefix } from '../constants';
import { ChangePasswordInput } from './types/input/ChangePasswordInput';
import 'dotenv-safe';
// import { isAuth } from '../middleware/isAuth';
import { logger } from '../middleware/logger';

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
  @Mutation(() => User)
  async createUser(
    @Arg('data') { username, email, password }: CreateUserInput
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    }).save();

    await sendEmail(email, await createConfirmationUrl(user.id));

    return user;
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

  // Login user, returns all user's lists from database
  @UseMiddleware(logger)
  @Mutation(() => User)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({
      where: { email: email },
      relations: ['listConnection']
    });
    if (!user) throw new Error('Login has failed..');

    const valid = await argon2.verify(user.password, password);
    if (!valid) throw new Error('Login has failed...');

    if (!user.confirmed) throw new Error('Email has not been confirmed..');

    ctx.req.session.userId = user.id;

    // let usersLists = await UserToList.find({
    //   where: { userId: user.id },
    //   relations: ['list', 'list.items', 'itemHistory']
    // });

    // If no lists were found, create one upon standard login
    if (!user.listConnection || !user.listConnection.length) {
      const list = await List.create({
        title: 'my-list'
      }).save();
      await UserToList.create({
        listId: list.id,
        userId: user.id,
        privileges: ['owner'] // Only list creator has owner rights
      }).save();
    }

    return user;
  }

  // Forgot password -- Probably refactor this to an express route from email
  @UseMiddleware(logger)
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) return false;

    const token = v4();
    await redis.set(forgetPasswordPrefix + token, user.id, 'ex', 60 * 60 * 24); // 1 day expiration

    await sendEmail(
      email,
      `http://localhost:3000/user/change-password/${token}`
    );

    return true;
  }

  // Change password with token from email
  @UseMiddleware(logger)
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg('data') { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgetPasswordPrefix + token);
    if (!userId) return null;

    const user = await User.findOne(userId);
    if (!user) return null;
    await redis.del(forgetPasswordPrefix + token);

    user.password = await argon2.hash(password);
    await user.save();

    ctx.req.session.userId = user.id;

    return user;
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
