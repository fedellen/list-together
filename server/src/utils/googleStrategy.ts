import { OAuth2Strategy } from 'passport-google-oauth';
import { BACKEND_URL } from '../constants';
import { getOrCreateUserByEmail } from '../services/user/getOrCreateUserByEmail';

export const googleStrategy = new OAuth2Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${BACKEND_URL}/auth/google/callback`
  },
  async (_, __, profile, cb) => {
    const { emails } = profile;
    if (emails) {
      const user = await getOrCreateUserByEmail(emails[0].value);
      // Return with userId to use in session callback
      return cb(null, { id: user.id });
    } else {
      console.error('Email on Google oAuth callback could not be found..');
      return cb('Email on Google oAuth callback could not be found..');
    }
  }
);
