/**
 * @file Authorization
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

export {};
const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const utilRedis = require('@utils/redis.util');
import { genResponseErrorSimple, genResponseSuccessData, genResponseSuccessSimple } from "@utils/response.util";
const utilValidator = require('@utils/validator.util');

/**
 * Get temporary token
 *
 * Create and send a temporary token to user. This token is used as a redis key, which will contain a persistent token.
 */
router.get('/token/temporary', async (req, res) => {
   let tokenTmp = null;

   // Should be unique
   while (tokenTmp === null) {
      let candidate = crypto.randomBytes(32).toString('hex') + new Date().getTime();
      let exists = await utilRedis.redisClient.existsCustom(candidate);
      if (!exists) tokenTmp = candidate;
   }

   res.json(
      genResponseSuccessData('Temporary token', {
         tokenTmp: tokenTmp,
      }),
   );
});

/**
 * Get persistent token
 *
 * Send persistent JWT token to user if he provides valid temporary token.
 */
router.get('/token/persistent', async (req, res) => {
   const tokenTmp = req.query.tokenTmp;

   // Validate temporary token
   if (!utilValidator.validateTokenTemporary(tokenTmp))
      return res.json(genResponseErrorSimple('Authorization failed. No temporary token;'));

   // Create JWT token with the temporary token as a key
   await utilRedis.redisClientAsync.get(tokenTmp).then(token => {
      res.json(
         genResponseSuccessData('Persistent JWT token', {
            token: token,
         }),
      );
   });
});

/**
 * Just verify token
 *
 * If token is valid - send 200. Otherwise auth middleware sends 401.
 */
router.get('/token/verify', async (req, res) => {
   res.json(genResponseSuccessSimple('JWT is valid.'));
});

module.exports = router;
