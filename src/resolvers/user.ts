import { List, User, UserToList } from '../entities';
import { Arg, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';

@Resolver(User)
export class UserResolver {
  // Create a User
  @Mutation(() => User)
  async createUser(
    // Arguments
    @Arg('username') username: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<UserToList> {
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

    return initialUserToList;
  }
}
