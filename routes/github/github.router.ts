/**
 * @file Github OAuth
 * @description Github OAuth init and callback pages.
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');

import configServer from '@config/server.config';

const utilRedis = require('@utils/redis.util');
const utilValidator = require('@utils/validator.util');

/**
 * URL redirects to github oauth server
 */
router.get(
   '/',
   (req, res, next) => {
      const tokenTmp = req.query.tokenTmp;

      // We need to have a temporary token to send a persistent token (it will be used at callback)
      if (!utilValidator.validateTokenTemporary(tokenTmp))
         return res.send('Authorization failed. No temporary token.');

      // Save temp token into user session
      req.session.tokenTmp = req.query.tokenTmp;

      next();
   },
   passport.authenticate('github', { session: false }),
);

/**
 * Callback from OAuth server
 */
router.get(
   '/callback',
   passport.authenticate('github', {
      session: false,
      failureRedirect: `${configServer.domain}/pages/github/fail`,
   }),
   (req, res) => {
      // Successful authentication from OAuth server
      const tokenTmp = req.session.tokenTmp;
      const userID = req.user.id;
      const authID = req.user.auth_id;
      const authType = req.user.auth_type;

      // Destroy session
      req.session = null;

      // Validate temporary token
      if (!utilValidator.validateTokenTemporary(tokenTmp))
         return res.send('Sorry, no temporary token provided.');

      // Create permanent token and save it to db
      utilRedis.redisClient
         .setTokenIntoTokenStorage(tokenTmp, userID, authID, authType)
         .then(() => {
            // Successful authorization
            res.send('Successful authorization, you can close this window.');
         });
   },
);

/**
 * Github OAuth failure
 */
router.get('/failure', (req, res) => {
   res.send('Github OAuth authorization failed. Unknown reason.');
});

module.exports = router;
