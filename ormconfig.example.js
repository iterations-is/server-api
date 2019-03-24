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
      entities: ['database/sql/models/**/*.ts'],
      // Migrations
      migrationsTableName: 'migrations',
      migrations: ['database/sql/migrations/*.ts'],
      cli: {
         migrationsDir: 'database/sql/migrations',
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
      entities: ['database/sql/models/**/*.ts'],
      // Seeds
      migrationsTableName: 'seeds',
      migrations: ['database/sql/seeds/*.ts'],
      cli: {
         migrationsDir: 'database/sql/seeds',
      },
   },
];
