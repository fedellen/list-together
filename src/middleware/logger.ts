import { MiddlewareFn } from 'type-graphql';

import { MyContext } from '../types/MyContext';

export const logger: MiddlewareFn<MyContext> = async (
  { args, context, info },
  next
) => {
  console.log(
    `🔥 New GraphQL Request! 🔥 
    Arguments: ${JSON.stringify(args)},
    UserId: ${context.req.session.userId},
    ResolverType: ${info.fieldName}`
  );

  return next();
};
