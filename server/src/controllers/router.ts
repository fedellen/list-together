import express from 'express';
import { /*confirmUserPrefix,*/ FRONT_END_URL } from '../constants';
// import { User } from '../entities';
// import { redis } from '../redis';
import passport from 'passport';
// import { OAuth2Strategy } from "passport-google-oauth"

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: 'email' }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    console.log('(req.user as any).id', (req.user as any).id);
    req.session.userId = (req.user as any).id;

    // res.redirect('http://localhost:4000/graphql');
    res.redirect(FRONT_END_URL);
  }
);

// router.get('/:id', async (req, res) => {
//   const token = req.params.id;

//   const userId = await redis.get(confirmUserPrefix + token);

//   if (!userId) {
//     res.sendStatus(404);
//   } else {
//     await User.update({ id: userId }, { confirmed: true });
//     await redis.del(confirmUserPrefix + token);
//     res.redirect(FRONT_END_URL);
//   }
// });

export default router;
