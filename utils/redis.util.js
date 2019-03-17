/**
 * @file Redis module
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

const jwt = require('jsonwebtoken');
const configJWT = require('config/jwt.config');
const redis = require('redis');
const { promisify } = require('util');
const databaseConfig = require('config/database.config');
const redisClient = redis.createClient({
   password: databaseConfig.redis.password,
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
