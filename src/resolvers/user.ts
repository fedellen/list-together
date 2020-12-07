import { List, User, UserToList } from '../entities';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { CreateUserInput } from './CreateUserInput/CreateUserInput';
import { MyContext } from '../types/MyContext';
// import { getRepository } from 'typeorm';

@Resolver()
export class UserResolver {
  // Create a User
  @Mutation(() => [UserToList])
  async createUser(
    // Arguments
    @Arg('data') { username, email, password }: CreateUserInput
  ): Promise<UserToList[]> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    }).save();

    const list = await List.create({
      title: 'my-list'
    }).save();
    const initialUserToList = await UserToList.create({
      listId: list.id,
      userId: user.id
    }).save();

    console.log(initialUserToList);

    return UserToList.find({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });
  }

  @Mutation(() => [UserToList])
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserToList[] | null> {
    const user = await User.findOne({ where: { email: email } });
    if (!user) throw new Error('A user with that email does not exist..');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Password does not match..');

    ctx.req.session.userId = user.id;

    const usersLists = await UserToList.find({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });

    console.log(usersLists);
    return usersLists;
  }
}
