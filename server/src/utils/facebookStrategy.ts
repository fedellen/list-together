import { Strategy } from 'passport-facebook';
import { createNewUser } from '../services/user/createNewUser';
import { User } from '../entities';

export const facebookStrategy = new Strategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:4000/auth/facebook/callback',
    profileFields: ['emails']
  },
  async (_, __, profile, cb) => {
    const { emails } = profile;
    if (emails) {
      const email = emails[0].value;
      // Look for existing user
      let user = await User.findOne({ where: { email: email } });
      if (!user) {
        // Email was not found in the database, create a new user
        user = await createNewUser(email);
      }
      // Return with userId to use in session callback
      return cb(null, { id: user.id });
    } else {
      return cb(
        'Email on Facebook oAuth callback could not be found. Be sure your Facebook account has a confirmed email -- Try another sign-in method if the error persists..'
      );
    }
  }
);
