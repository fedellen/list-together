import { MiddlewareFn } from 'type-graphql';

import { MyContext } from '../MyContext';

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error('Not authenticated..');
  }

  return next();
};
