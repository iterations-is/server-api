export default {
   redis: {
      // Redis database password
      password: 'RedisPassword',
      // Expiration time in seconds for "temporaryToken" => "persistentToken" during authorization
      expirationTokenStorage: 10 * 60,
   },
   mongo: {
      // MongoDB connection url
      url: 'mongodb://localhost:27017/iterations',
   },
};
