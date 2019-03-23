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

   async setTokenIntoTemporaryToken(tokenTmp, userID, userOAuth, userName) {
      const token = jwt.sign(
         {
            user_id: userID,
            user_oauth: userOAuth,
            user_name: userName,
         },
         configJWT.secret,
         {
            expiresIn: 10 * 60,
         },
      );

      await redisClientAsync.set(tokenTmp, token, 'EX', configJWT.expiration);
   }
}

let redisClientMy = new Redis();

module.exports = {
   redisClient: redisClientMy,
   redisClientAsync,
};
