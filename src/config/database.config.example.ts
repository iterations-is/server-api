export default {
   redis: {
      // Redis connection
      host: '192.168.0.141',
      port: 6379,
      password: 'RedisPassword',
      // Expiration time in seconds for "temporaryToken" => "persistentToken" during authorization
      expirationTokenStorage: 10 * 60,
   },
   mongo: {
      // MongoDB connection url
      url: 'mongodb://localhost:27017/iterations',
   },
};
