module.exports = {
   apps: [
      {
         name: 'Iterations-API',
         script: 'ts-node',
         args: '-P tsconfig.json ./app.ts',
         instances: 1,
         autorestart: true,
         env: {},
         env_development: {
            NODE_ENV: 'development',
            watch: true,
         },
         env_production: {
            NODE_ENV: 'production',
         },
      },
   ],
};
