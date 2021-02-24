import { User } from '../../entities';
import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';

@Resolver()
export class GetUserResolver {
  /** Get current user from session context */
  @UseMiddleware(logger)
  @Query(() => User, { nullable: true })
  async getUser(@Ctx() { req }: MyContext): Promise<User | null> {
    // User not logged in
    if (!req.session.userId) return null;

    const user = await User.findOne(req.session.userId);
    // User was not found..
    if (!user) return null;

    return user;
  }
}
