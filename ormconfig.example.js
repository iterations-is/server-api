module.exports = [
   {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'iterations',
      password: 'pass',
      database: 'iterations',
      synchronize: true,
      logging: false,
      entities: ['src/database/sql/models/**/*.ts'],
      // Migrations
      migrationsTableName: 'migrations',
      migrations: ['src/database/sql/migrations/*.ts'],
      cli: {
         migrationsDir: 'src/database/sql/migrations',
      },
   },
   {
      // Duplicate connection for seeds (masked migrations)
      name: 'seed',

      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'iterations',
      password: 'pass',
      database: 'iterations',
      logging: false,
      entities: ['src/database/sql/models/**/*.ts'],
      // Seeds
      migrationsTableName: 'seeds',
      migrations: ['src/database/sql/seeds/*.ts'],
      cli: {
         migrationsDir: 'src/database/sql/seeds',
      },
   },
];
