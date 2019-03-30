/**
 * @file Server
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

// Import external
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
import { createTypeormConnection } from '@utils/typeorm.util';
// Import configs
import configServer from '@config/server.config';
import configCookie from '@config/cookie.config';
import configDatabase from '@config/database.config';
// Utilities
import logger from '@utils/logger.util';
import { responseSimple } from '@utils/response.util';
// Import middleware
const mwarePassport = require('@utils/passport.util');
const mwareCookie = require('cookie-session');
import mwareCORS from '@middlewares/cors.mw';
import mwareAuth from '@middlewares/auth.mw';
// Import routers
import routerAPI from '@api/Router';
import routerPages from '@routes/Router';

// -------------------------------------------------------------------------------------------------
// Application
// -------------------------------------------------------------------------------------------------
const app = express();

// -------------------------------------------------------------------------------------------------
// Middleware
// -------------------------------------------------------------------------------------------------
// Use cookies for auth
app.use(
   mwareCookie({
      maxAge: configCookie.maxAge,
      keys: configCookie.keys,
   }),
);
app.use(passport.initialize()); // Init passport
app.use(mwareCORS); // Allow CORS
app.use(express.json()); // Parse json
app.use(mwareAuth); // Checks authorization if required

// -------------------------------------------------------------------------------------------------
// Routes
// -------------------------------------------------------------------------------------------------
app.use('/api', routerAPI);
app.use('/pages', routerPages);

app.use(function(req, res) {
   return responseSimple(res, 404, 'Required path does not exist!');
});

// -------------------------------------------------------------------------------------------------
// Server initialize
// -------------------------------------------------------------------------------------------------
(async () => {
   try {
      if (!process.env.NODE_ENV) {
         logger.error('You need to provide NODE_ENV. Process exit.');
         process.exit(1);
      }

      logger.info('Connecting to databases...');

      // Start SQL DB
      await createTypeormConnection();
      logger.info('SQL database connected');

      // Start MongoDB
      await mongoose.connect(configDatabase.mongo.url, {
         useNewUrlParser: true,
      });
      logger.info('NoSQL database connected');

      // Start server
      app.listen(configServer.port, () => {
         logger.info(`Server started at http://localhost:${configServer.port}`);
      });
   } catch (e) {
      logger.error(e);
      process.exit(1);
   }
})();
