import express from 'express';
import { FRONTEND_URL } from '../constants';
import passport from 'passport';

const oAuthRouter = express.Router();

oAuthRouter.get('/google', passport.authenticate('google', { scope: 'email' }));

oAuthRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    req.session.userId = (req.user as any).id;
    res.redirect(FRONTEND_URL);
  }
);

oAuthRouter.get('/twitter', passport.authenticate('twitter'));

oAuthRouter.get(
  '/twitter/callback',
  passport.authenticate('twitter', { session: false }),
  (req, res) => {
    req.session.userId = (req.user as any).id;
    res.redirect(FRONTEND_URL);
  }
);

oAuthRouter.get(
  '/facebook',
  passport.authenticate('facebook', { scope: 'email' })
);

oAuthRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    req.session.userId = (req.user as any).id;
    res.redirect(FRONTEND_URL);
  }
);

export default oAuthRouter;
