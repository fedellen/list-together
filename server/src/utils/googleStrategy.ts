import { OAuth2Strategy } from 'passport-google-oauth';
import { createNewUser } from '../services/user/createNewUser';
import { User } from '../entities';

export const googleStrategy = new OAuth2Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/auth/google/callback'
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
      console.error('Email on Google oAuth callback could not be found..');
      return cb('Email on Google oAuth callback could not be found..');
    }
  }
);
