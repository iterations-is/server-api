/**
 * @file PassportJS
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('models/UserModel');
const configOAuth = require('config/oauth.config');

// passport.serializeUser((user, done) => {
//    done(null, user.id);
// });
//
// passport.deserializeUser((id, done) => {
//    User.findById(id).then(user => {
//       done(null, user);
//    });
// });

passport.use(
   new GitHubStrategy(
      {
         // Strategy options
         callbackURL: configOAuth.github.callback,
         clientID: configOAuth.github.clientID,
         clientSecret: configOAuth.github.clientSecret,
      },
      (accessToken, refreshToken, profile, done) => {
         // Successful authorization

         // TODO Rewrite to SQL
         User.findOne({
            ghid: profile.id,
            typeOfAuth: configOAuth.github.uniqueName,
         }).then(curUser => {
            if (curUser) {
               done(null, curUser);
            } else {
               new User({
                  ghid: profile.id,
                  username: profile.username,
                  typeOfAuth: configOAuth.github.uniqueName,
               })
                  .save()
                  .then(newUser => {
                     done(null, newUser);
                  });
            }
         });
      },
   ),
);
