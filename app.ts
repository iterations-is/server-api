/**
 * @file Server
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

// Import external
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
import { createConnection } from 'typeorm';
// Import configs
import configServer from '@config/server.config';
import configCookie from '@config/cookie.config';
import configDatabase from '@config/database.config';
// Utilities
import logger from '@utils/logger.util';
import { genResponseErrorSimple } from '@utils/response.util';
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
   res.status(404).send(genResponseErrorSimple('Required path does not exist!'));
});

// -------------------------------------------------------------------------------------------------
// Server initialize
// -------------------------------------------------------------------------------------------------
(async () => {
   try {
      logger.info('Connecting to databases...');

      // Start SQL DB
      await createConnection();
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
