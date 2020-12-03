import { User } from '../entities';
import { Arg, Mutation, Resolver } from 'type-graphql';
import * as bcrypt from 'bcryptjs';

@Resolver(User)
export class UserResolver {
  // Create a User
  @Mutation(() => User)
  async createUser(
    // Arguments
    @Arg('username') username: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    }).save();

    return user; // exposes email, username, and id to the GraphQL API
  }
}
