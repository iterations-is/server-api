/**
 * @file Server
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

// -------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------
// Alias manager
require('module-alias/register');
// Import external
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
// Import configs
const configServer = require('config/server.config');
const configCookie = require('config/cookie.config');
const configDatabase = require('config/database.config');
// Import middleware
const mwarePassport = require('utils/passport.util');
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
mongoose
   .connect(configDatabase.mongo.url, {
      useNewUrlParser: true,
   })
   .then(() => {
      // Start server
      app.listen(configServer.port, () => {
         // FIXME log
         console.log(`Server http://localhost:${configServer.port}`);
      });
   })
   .catch(() => {
      // FIXME log
      console.log(`MongoDB failed.`);
      process.exit(1);
   });
