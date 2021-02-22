import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { User, List, UserToList } from '../entities';

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/auth/google/callback'
  },
  async (_, __, profile, cb) => {
    const { emails } = profile;
    if (emails) {
      const email = emails[0].value;
      let user = await User.findOne({ where: { email: email } });
      if (!user) {
        // Email was not found in the database, create a new user
        const firstList = await List.create({
          title: 'my-list'
        }).save();
        user = await User.create({
          email: email,
          sortedListsArray: [firstList.id]
        }).save();
        await UserToList.create({
          listId: firstList.id,
          userId: user.id,
          privileges: 'owner',
          list: firstList
        }).save();
      }

      return cb(null, { id: user.id });
    } else {
      return cb('Email on Google oAuth callback could not be found..');
    }
  }
);
