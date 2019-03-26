/**
 * @file Redis module
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

export {};
const jwt = require('jsonwebtoken');
import configJWT from '@config/jwt.config';
const redis = require('redis');
const { promisify } = require('util');
import configDatabase from '@config/database.config';
const redisClient = redis.createClient({
   host: configDatabase.redis.host,
   port: configDatabase.redis.port,
   password: configDatabase.redis.password,
});

const redisClientAsync = {
   get: promisify(redisClient.get).bind(redisClient),
   set: promisify(redisClient.set).bind(redisClient),
};

let instance = null;

class Redis {
   constructor() {
      if (instance) return instance;
      instance = this;
   }

   async existsCustom(key) {
      let value = await redisClientAsync.get(key);
      return value !== null;
   }

   async setTokenIntoTokenStorage(
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

      await redisClientAsync.set(
         tokenTmp,
         token,
         'EX',
         configDatabase.redis.expirationTokenStorage,
      );
   }
}

let redisClientMy = new Redis();

module.exports = {
   redisClient: redisClientMy,
   redisClientAsync,
};
