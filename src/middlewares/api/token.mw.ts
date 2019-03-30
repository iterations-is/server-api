/**
 * @file Project Categories
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { responseData, responseSimple } from '@utils/response.util';
import { validateTokenTemporary } from '@utils/validator.util';
import { generateTokenTemporary } from '@utils/tokens.util';
import { redisClientAsync, redisExistsKey } from '@utils/redis.util';

/**
 * @summary Get temporary token
 * @desc Create and send a temporary token to user. This token is used as a redis key, which will contain a persistent token.
 * @param req
 * @param res
 */
export const mwGetTokenTemporary = async (req, res, next) => {
   let tokenTmp = null;

   // Should be unique
   while (tokenTmp === null) {
      let candidate = generateTokenTemporary();
      let exists = await redisExistsKey(candidate);
      if (!exists) tokenTmp = candidate;
   }

   return responseData(res, 200, 'Temporary token', { tokenTmp: tokenTmp });
};

/**
 * @summary Get persistent token
 * @desc Send persistent JWT token to user if he provides valid temporary token.
 * @param req
 * @param res
 */
export const mwGetTokenPersistent = async (req, res, next) => {
   const tokenTmp = req.query.tokenTmp;

   // Validate temporary token
   if (!validateTokenTemporary(tokenTmp))
      return responseSimple(res, 400, 'Authorization failed. No temporary token!');

   // Create JWT token with the temporary token as a key
   await redisClientAsync.get(tokenTmp).then(token => {
      return responseData(res, 200, 'Persistent JWT token', { token: token });
   });
};

/**
 * Verify persistent token
 * @desc If token is valid - send 200. Otherwise auth middleware sends 401.
 * @param req
 * @param res
 */
export const mwVerifyTokenPersistent = async (req, res, next) => {
   return responseSimple(res, 200, 'Persistent token is valid.');
};
