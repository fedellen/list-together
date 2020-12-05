import { List, User, UserToList } from '../entities';
import { Arg, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { RegisterInput } from './input/RegisterInput';
import { getRepository } from 'typeorm';

@Resolver()
export class UserResolver {
  // Create a User
  @Mutation(() => [UserToList])
  async createUser(
    // Arguments
    @Arg('data') { username, email, password }: RegisterInput
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

    return getRepository(UserToList).find({
      where: { userId: user.id },
      relations: ['list', 'list.items', 'itemHistory']
    });
  }
}
