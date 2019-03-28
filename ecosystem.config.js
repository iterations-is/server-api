module.exports = {
   apps: [
      {
         name: 'Iterations-API',
         script: 'ts-node',
         args: '-P tsconfig.json -r tsconfig-paths/register ./app.ts',
         instances: 1,
         autorestart: true,
         env: {},
         env_development: {
            NODE_ENV: 'development',
            name: 'Iterations-API-DEV',
            watch: ['./**/*.ts', './**/*.js', './**/*.json'],
         },
         env_test: {
            NODE_ENV: 'test',
            name: 'Iterations-API-TEST',
         },
         env_production: {
            NODE_ENV: 'production',
         },
         output: './logs/output.log',
      },
   ],
};
