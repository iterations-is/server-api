/**
 * @file Server
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

// -------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------
// Import external
const express = require('express');
const mongoose = require('mongoose');
import { createConnection } from 'typeorm';
const passport = require('passport');
// Import configs
import configServer from '@config/server.config';
import configCookie from '@config/cookie.config';
import configDatabase from '@config/database.config';
// Import middleware
const mwarePassport = require('@utils/passport.util');
const mwareCORS = require('middlewares/cors.mw');
const mwareAuth = require('middlewares/auth.mw');
const mwareCookie = require('cookie-session');
// Import routers
const routerAPI = require('./api/Router');
const routerPages = require('./routes/Router');

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
   res.status(404).send("404 // Sorry can't find that!");
});

// -------------------------------------------------------------------------------------------------
// Server initialize
// -------------------------------------------------------------------------------------------------

(async () => {
   try {
      // Start SQL DB
      // @ts-ignore
      await createConnection();

      // Start MongoDB
      await mongoose.connect(configDatabase.mongo.url, {
         useNewUrlParser: true,
      });

      // Start server
      app.listen(configServer.port, () => {
         // FIXME log
         console.log(`Server http://localhost:${configServer.port}`);
      });
   } catch (e) {
      console.log(e);
      process.exit(1);
   }
})();
