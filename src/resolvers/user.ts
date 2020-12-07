import { List, User, UserToList } from '../entities';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { CreateUserInput } from './input-types/CreateUserInput';
import { MyContext } from '../types/MyContext';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmationUrl } from '../utils/confirmationUrl';
import { redis } from '../redis';
import { v4 } from 'uuid';
import { confirmUserPrefix, forgetPasswordPrefix } from '../constants';
import { ChangePasswordInput } from './input-types/ChangePasswordInput';

@Resolver()
export class UserResolver {
  // Create a User
  @Mutation(() => User)
  async createUser(
    @Arg('data') { username, email, password }: CreateUserInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    }).save();

    await sendEmail(email, await createConfirmationUrl(user.id));

    return user;
  }

  // Login user, returns all user's lists from database
  @Mutation(() => [UserToList])
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserToList[] | null> {
    const user = await User.findOne({ where: { email: email } });
    if (!user) throw new Error('Login has failed..');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Login has failed...');

    if (!user.confirmed) throw new Error('Email has not been confirmed..');

    ctx.req.session.userId = user.id;

    let usersLists = await UserToList.find({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });

    // If no lists were found, create one upon standard login
    if (!usersLists || !usersLists.length) {
      const list = await List.create({
        title: 'my-list'
      }).save();
      await UserToList.create({
        listId: list.id,
        userId: user.id
      }).save();
      usersLists = await UserToList.find({
        where: { userId: user.id },
        relations: ['list', 'list.items', 'itemHistory']
      });
    }

    return usersLists;
  }

  // Confirm user -- Change this to an express route?
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

  // Forgot password -- sendEmail
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

  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg('data') { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<UserToList[] | null> {
    const userId = await redis.get(forgetPasswordPrefix + token);
    if (!userId) return null;

    const user = await User.findOne(userId);
    if (!user) return null;
    await redis.del(forgetPasswordPrefix + token);

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    ctx.req.session.userId = user.id;

    return UserToList.find({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });
  }

  @Mutation()
}

