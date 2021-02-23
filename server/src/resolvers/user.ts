import { Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { logger } from '../middleware/logger';
import { User } from '../entities';
import { MyContext } from '../MyContext';

/**
 * Resolver for handling `getUser` and `logout`
 * Auth is handled via passport in an express router
 */
@Resolver()
export class UserResolver {
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

  /** Logout the user, destroy the session, clear that cookie */
  @UseMiddleware(logger)
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
