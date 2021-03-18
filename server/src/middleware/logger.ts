import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../MyContext';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, json } = format;

const winstonLogger = createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({
      filename: `logs/${new Date().toDateString()}.log`
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  winstonLogger.add(new transports.Console({ format: format.simple() }));
}

/** Logging middleware for GraphQL resolvers */
export const logger: MiddlewareFn<MyContext> = async (
  { args, context, info },
  next
) => {
  /** Don't log resolver info in test */
  if (process.env.NODE_ENV !== 'test') {
    winstonLogger.info([
      `ResolverType: >>> ${info.fieldName} <<<`,
      ` UserId: >> ${context.req.session.userId} <<`,
      ` Arguments: ${JSON.stringify(args)}`
    ]);
  }

  return next();
};
