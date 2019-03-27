/**
 * @file Redis module
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import configJWT from '@config/jwt.config';
import configDatabase from '@config/database.config';
import logger from '@utils/logger.util';

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const redis = require('redis');

// -------------------------------------------------------------------------------------------------
// Methods
// -------------------------------------------------------------------------------------------------

// Sync Client
export const redisClientCallbacks = redis.createClient({
   host: configDatabase.redis.host,
   port: configDatabase.redis.port,
   password: configDatabase.redis.password,
});

export const redisClientAsync = {
   get: promisify(redisClientCallbacks.get).bind(redisClientCallbacks),
   set: promisify(redisClientCallbacks.set).bind(redisClientCallbacks),
};

export async function redistExistsKey(key) {
   let value = await redisClientAsync.get(key);
   return value !== null;
}

export async function redisSetTokenIntoStorage(
   tokenTmp: string,
   userID: number,
   authID: number,
   authType: string,
) {
   const token = jwt.sign(
      {
         user_id: userID,
         auth_id: authID,
         auth_type: authType,
      },
      configJWT.secret,
      { expiresIn: configJWT.expiration },
   );

   await redisClientAsync.set(tokenTmp, token, 'EX', configDatabase.redis.expirationTokenStorage);
}

logger.debug('Utility:Redis start.');
