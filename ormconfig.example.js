// ----------------------------------------------------------------------------------------------
// PRIVATE USER CONFIGURATION
// ----------------------------------------------------------------------------------------------

const data = {
   development: {
      type: 'postgres',
      host: '192.168.0.141',
      port: 5432,
      username: 'iterations',
      password: 'pass',
      database: 'iterations-dev',
   },
   test: {
      type: 'postgres',
      host: '192.168.0.141',
      port: 5433,
      username: 'iterations',
      password: 'pass',
      database: 'iterations-test',
   },
   production: {
      type: 'postgres',
      host: '192.168.0.141',
      port: 5434,
      username: 'iterations',
      password: 'pass',
      database: 'iterations-prod',
   },
};

// ----------------------------------------------------------------------------------------------
// READ ONLY SECTION
// ----------------------------------------------------------------------------------------------

module.exports = [
   // ----------------------------------------------------------------------------------------------
   // Development
   // ----------------------------------------------------------------------------------------------

   {
      // Default connection with migrations
      ...data.development,
      name: 'development',
      synchronize: true,
      logging: true,
      entities: ['src/database/sql/models/**/*.ts'],
      migrationsTableName: 'migrations',
      migrations: ['src/database/sql/migrations/*.ts'],
      cli: { migrationsDir: 'src/database/sql/migrations' },
   },
   {
      // Duplicate connection for seeds (masked migrations)
      ...data.development,
      name: 'development-seed',
      logging: true,
      entities: ['src/database/sql/models/**/*.ts'],
      migrationsTableName: 'seeds',
      migrations: ['src/database/sql/seeds/*.ts'],
      cli: { migrationsDir: 'src/database/sql/seeds' },
   },

   // ----------------------------------------------------------------------------------------------
   // Testing
   // ----------------------------------------------------------------------------------------------
   {
      ...data.test,
      name: 'test',
      logging: false,
      dropSchema: true,
      synchronize: true,
      entities: ['src/database/sql/models/**/*.ts'],
      migrationsTableName: 'migrations',
      migrations: ['src/database/sql/migrations/*.ts'],
   },
   {
      // Duplicate connection for seeds (masked migrations)
      ...data.test,
      name: 'test-seed',
      logging: false,
      migrationsRun: true,
      entities: ['src/database/sql/models/**/*.ts'],
      migrationsTableName: 'seeds',
      migrations: ['src/database/sql/seeds/*.ts'],
   },

   // ----------------------------------------------------------------------------------------------
   // Production
   // ----------------------------------------------------------------------------------------------

   {
      ...data.production,
      name: 'production',
      synchronize: true,
      logging: true,
      entities: ['src/database/sql/models/**/*.ts'],
      migrationsTableName: 'migrations',
      migrations: ['src/database/sql/migrations/*.ts'],
      cli: { migrationsDir: 'src/database/sql/migrations' },
   },
   {
      // Duplicate connection for seeds (masked migrations)
      ...data.production,
      name: 'production-seed',
      logging: true,
      entities: ['src/database/sql/models/**/*.ts'],
      migrationsTableName: 'seeds',
      migrations: ['src/database/sql/seeds/*.ts'],
      cli: { migrationsDir: 'src/database/sql/seeds' },
   },
];
