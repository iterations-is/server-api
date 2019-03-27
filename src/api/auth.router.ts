/**
 * @file Authorization API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   genResponseErrorSimple,
   genResponseSuccessData,
   genResponseSuccessSimple,
} from '@utils/response.util';
import { redistExistsKey, redisClientAsync } from '@utils/redis.util';
import { validateTokenTemporary } from '@utils/validator.util';
import { generateTokenTemporary } from '@utils/generator.util';

const express = require('express');
const router = express.Router();

// -------------------------------------------------------------------------------------------------
// Routes
// -------------------------------------------------------------------------------------------------

router.get('/token/temporary', getTemporaryToken);
router.get('/token/persistent', getPersistentToken);
router.get('/token/verify', verifyToken);
export default router;

// -------------------------------------------------------------------------------------------------
// Methods
// -------------------------------------------------------------------------------------------------

/**
 * @summary Get temporary token
 * @desc Create and send a temporary token to user. This token is used as a redis key, which will contain a persistent token.
 * @param req
 * @param res
 */
async function getTemporaryToken(req, res) {
   let tokenTmp = null;

   // Should be unique
   while (tokenTmp === null) {
      let candidate = generateTokenTemporary();
      let exists = await redistExistsKey(candidate);
      if (!exists) tokenTmp = candidate;
   }

   res.json(
      genResponseSuccessData('Temporary token', {
         tokenTmp: tokenTmp,
      }),
   );
}

/**
 * @summary Get persistent token
 * @desc Send persistent JWT token to user if he provides valid temporary token.
 * @param req
 * @param res
 */
async function getPersistentToken(req, res) {
   const tokenTmp = req.query.tokenTmp;

   // Validate temporary token
   if (!validateTokenTemporary(tokenTmp))
      return res.json(genResponseErrorSimple('Authorization failed. No temporary token;'));

   // Create JWT token with the temporary token as a key
   await redisClientAsync.get(tokenTmp).then(token => {
      res.json(
         genResponseSuccessData('Persistent JWT token', {
            token: token,
         }),
      );
   });
}

/**
 * @summary Just verify token
 * @desc If token is valid - send 200. Otherwise auth middleware sends 401.
 * @param req
 * @param res
 */
async function verifyToken(req, res) {
   res.json(genResponseSuccessSimple('JWT is valid.'));
}
