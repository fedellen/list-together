import { Strategy } from 'passport-facebook';
import { getOrCreateUserByEmail } from '../services/user/getOrCreateUserByEmail';

export const facebookStrategy = new Strategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/facebook/callback`,
    profileFields: ['emails']
  },
  async (_, __, profile, cb) => {
    const { emails } = profile;
    if (emails) {
      const user = await getOrCreateUserByEmail(emails[0].value);
      // Return with userId to use in session callback
      return cb(null, { id: user.id });
    } else {
      return cb(
        'Email on Facebook oAuth callback could not be found. Be sure your Facebook account has a confirmed email -- Try another sign-in method if the error persists..'
      );
    }
  }
);
