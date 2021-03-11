import express from 'express';
import oAuthRouter from './controllers/oAuthRouter';
import passport from 'passport';
import { googleStrategy } from './utils/googleStrategy';
import { sessionMiddleware } from './middleware/session';
import { twitterStrategy } from './utils/twitterStrategy';
import { facebookStrategy } from './utils/facebookStrategy';

import RateLimit from 'express-rate-limit';

import RedisStore from 'rate-limit-redis';
import { redis } from './redis';

/** Express app */
const app = express();

// // Use 'trust proxy' when behind nginx etc.
app.set('trust proxy', 1);

// Add global rate limit in case malicious spam from IP
app.use(
  RateLimit({
    store: new RedisStore({
      client: redis
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 1000 requests per windowMs
  })
);

app.use(sessionMiddleware);

// Add passport for oAuth: Google | Twitter | Facebook
passport.use(googleStrategy);
passport.use(twitterStrategy);
passport.use(facebookStrategy);

app.use(passport.initialize());
app.use('/auth', oAuthRouter);

export default app;
