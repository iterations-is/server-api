export default {
   redis: {
      password: 'RedisPassword',
   },
   mongo: {
      url: 'mongodb://localhost:27017/iterations',
   },
   sql: {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'pass',
      database: 'iterations',
      synchronize: true,
      logging: false,
      entities: ['database/sql/models/**/*.ts'],
      migrations: ['database/sql/migrations/**/*.ts'],
   },
};
