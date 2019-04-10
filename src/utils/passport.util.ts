/**
 * @file PassportJS
 * @description Set strategies and handle authorizations – find or create the authorized used in DB.
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { UsersModel } from '@modelsSQL/Users.model';
import { GlobalRolesModel } from '@modelsSQL/GlobalRoles.model';
import configOAuth from '@config/oauth.config';
import logger from '@utils/logger.util';

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

/**
 * Strategy initialization
 * User information is provided as req.user = {}; to all next middlewares.
 */
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
         const sqlRepoUser = getConnection().getRepository(UsersModel);

         // Try to find existing user
         try {
            let user = await sqlRepoUser.findOneOrFail({
               where: {
                  auth_id: responseId,
                  auth_type: configOAuth.github.uniqueName,
               },
            });

            // Update if need
            if (user.authName !== responseName) {
               user.authName = responseName;
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
               .getRepository(GlobalRolesModel)
               .findOne({ where: { name: 'user' } });

            let user = new UsersModel();
            user.authId = responseId;
            user.authType = configOAuth.github.uniqueName;
            user.authUsername = `${responseUsername}-g${responseId}`;
            user.authName = responseName;
            user.role = role;

            try {
               await sqlRepoUser.save(user);
               done(null, user);
            } catch (e) {
               done(null, false);
            }
         }
      },
   ),
);

logger.debug('Utility:Passport start.');
