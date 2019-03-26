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
            watch: ['./**/*.ts', './**/*.js', './**/*.json'],
         },
         env_production: {
            NODE_ENV: 'production',
         },
         output: './logs/output.log',
      },
   ],
};
