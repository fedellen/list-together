import { Strategy } from 'passport-twitter';
import { getOrCreateUserByEmail } from '../services/user/getOrCreateUserByEmail';

export const twitterStrategy = new Strategy(
  {
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/twitter/callback`,
    includeEmail: true
  },
  async (_, __, profile, cb) => {
    const { emails } = profile;
    if (emails) {
      const user = await getOrCreateUserByEmail(emails[0].value);
      // Return with userId to use in session callback
      return cb(null, { id: user.id });
    } else {
      console.error('Email on Twitter oAuth callback could not be found..');
      return cb('Email on Twitter oAuth callback could not be found..');
    }
  }
);
