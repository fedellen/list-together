import express from 'express';
import oAuthRouter from './controllers/oAuthRouter';
import passport from 'passport';
import { googleStrategy } from './utils/googleStrategy';
import { sessionMiddleware } from './middleware/session';
import { twitterStrategy } from './utils/twitterStrategy';

/** Express app */
const app = express();

app.use(sessionMiddleware);

// Add passport for oAuth: Google | Twitter | Facebook
passport.use(googleStrategy);
passport.use(twitterStrategy);

app.use(passport.initialize());
app.use('/auth', oAuthRouter);

// // Use 'trust proxy' when behind nginx etc.
// app.set('trust proxy', 1);

export default app;
