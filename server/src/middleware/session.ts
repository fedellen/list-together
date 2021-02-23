import connectRedis from 'connect-redis';
import session from 'express-session';
import { __prod__ } from '../constants';
import { redis } from '../redis';

const RedisStore = connectRedis(session);

export const sessionMiddleware = session({
  store: new RedisStore({
    client: redis
  }),
  name: process.env.COOKIE_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: __prod__, // true in prod
    maxAge: 1000 * 60 * 60 * 24 * 15 * 365, // 15 years
    sameSite: 'strict'
  }
});
