const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/UserModel');

passport.serializeUser((user, done) => {
   console.log(`SERIALIZE`);
   done(null, user.id);
});

passport.deserializeUser((id, done) => {
   console.log(`DESERIALIZE`);
   User.findById(id).then(user => {
      done(null, user);
   });
});

passport.use(
   new GitHubStrategy(
      {
         // options fo strategy
         callbackURL: '/api/login/service/github/callback',
         clientID: '171634ba2f2e8b6fee89',
         clientSecret: '5172c7193df10bdbd5b722e91823485b1d060630',
      },
      (accessToken, refreshToken, profile, done) => {
         console.log(`ADD USER TO DB`);
         console.log(profile);

         // done(null, { omg: 'what' });

         User.findOne({
            ghid: profile.id,
         }).then(curUser => {
            if (curUser) {
               console.log(`old user:`);
               console.log(curUser);
               done(null, curUser);
            } else {
               new User({
                  ghid: profile.id,
                  username: profile.username,
               })
                  .save()
                  .then(newUser => {
                     console.log(`new user created:`);
                     console.log(newUser);
                     done(null, newUser);
                  });
            }
         });

         // User.findOrCreate({ githubId: profile.id }, function (err, user) {
         //    return cb(err, user);
         //  });
      },
   ),
);
