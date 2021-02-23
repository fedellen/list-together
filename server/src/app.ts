import express from 'express';
import oAuthRouter from './controllers/oAuthRouter';
import passport from 'passport';
import { googleStrategy } from './utils/googleStrategy';
import { sessionMiddleware } from './middleware/session';

const app = express();

app.use(sessionMiddleware);

passport.use(googleStrategy);
app.use(passport.initialize());

// app.set('trust proxy', 1);
app.use('/auth', oAuthRouter);

export default app;
