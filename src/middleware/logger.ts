import { MiddlewareFn } from 'type-graphql';

import { MyContext } from '../MyContext';

export const logger: MiddlewareFn<MyContext> = async (
  { args, context, info },
  next
) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(
      `🔥 New GraphQL Request! 🔥 
    Arguments: ${JSON.stringify(args, null, 4)},
    UserId: ${context.req.session.userId},
    ResolverType: ${info.fieldName}`
    );
  }

  return next();
};
