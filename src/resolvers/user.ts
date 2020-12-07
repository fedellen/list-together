import { List, User, UserToList } from '../entities';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { CreateUserInput } from './CreateUserInput/CreateUserInput';
import { MyContext } from '../types/MyContext';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmationUrl } from '../utils/confirmationUrl';
import { redis } from '../redis';

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

    // If no lists were found, create one upon login
    if (!usersLists) {
      const list = await List.create({
        title: 'my-list'
      }).save();
      const initialUserToList = await UserToList.create({
        listId: list.id,
        userId: user.id
      }).save();
      usersLists = [initialUserToList];
    }

    return usersLists;
  }

  // Confirm user
  @Mutation(() => Boolean)
  async confirmUser(@Arg('token') token: string): Promise<boolean> {
    const userId = await redis.get(token);

    if (!userId) {
      return false;
    }

    await User.update({ id: userId }, { confirmed: true });
    await redis.del(token);

    return true;
  }
}
