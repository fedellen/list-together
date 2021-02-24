import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';

@Resolver()
export class LogoutResolver {
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
