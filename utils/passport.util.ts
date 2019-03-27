/**
 * @file PassportJS
 * @description Set strategies and handle authorizations – find or create the authorized used in DB.
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

// DB
import { getConnection } from 'typeorm';
import { Users } from '@sqlmodels/Users.model';
import { GlobalRoles } from '@sqlmodels/GlobalRoles.model';

// Passport
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
import configOAuth from '@config/oauth.config';
import logger from '@utils/logger.util';

passport.use(
   new GitHubStrategy(
      {
         // Strategy options
         callbackURL: configOAuth.github.callback,
         clientID: configOAuth.github.clientID,
         clientSecret: configOAuth.github.clientSecret,
      },
      async (accessToken, refreshToken, profile, done) => {
         // Successful authorization

         const responseId = profile.id;
         const responseUsername = profile.username;
         const responseName = profile._json.name;
         const sqlRepoUser = getConnection().getRepository(Users);

         // Try to find existing user
         try {
            let user = await sqlRepoUser.findOneOrFail({
               where: {
                  auth_id: responseId,
                  auth_type: configOAuth.github.uniqueName,
               },
            });

            // Update if need
            if (user.auth_name !== responseName || user.auth_username !== responseUsername) {
               user.auth_username = responseUsername;
               user.auth_name = responseName;

               try {
                  await sqlRepoUser.save(user);
               } catch (e) {
                  done(null, false);
                  return;
               }
            }

            done(null, user);
         } catch (e) {
            // User does not exist => registration

            // Get user role
            const role = await getConnection()
               .getRepository(GlobalRoles)
               .findOne({ where: { name: 'user' } });

            let user = new Users();
            user.auth_id = responseId;
            user.auth_type = configOAuth.github.uniqueName;
            user.auth_username = responseUsername;
            user.auth_name = responseName;
            user.role = role;

            try {
               await sqlRepoUser.save(user);
               done(null, user);
            } catch (e) {
               done(null, false);
            }
         }

         // User information is provided as req.user = {};
      },
   ),
);

logger.debug('Utility:Passport start.');
