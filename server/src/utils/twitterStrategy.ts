import { Strategy } from 'passport-twitter';
import { createNewUser } from '../services/user/createNewUser';
import { User } from '../entities';

export const twitterStrategy = new Strategy(
  {
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: 'http://localhost:4000/auth/twitter/callback',
    includeEmail: true
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
      console.error('Email on Twitter oAuth callback could not be found..');
      return cb('Email on Twitter oAuth callback could not be found..');
    }
  }
);
