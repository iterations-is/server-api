// -------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------
// Import external
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cooSes = require('cookie-session');
// Import configs
const configServer = require('./config/server.config');
// Import middleware
const mwareCORS = require('./middlewares/cors.mw');
const mwareAuth = require('./middlewares/auth.mw');
// Import parts

const routes = require('./router');
const passportConfig = require('./modules/passport');

// -------------------------------------------------------------------------------------------------
// Application
// -------------------------------------------------------------------------------------------------
const app = express();

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true }, () => {
   console.log('connected to mdb');
});

app.use(
   cooSes({
      maxAge: 24 * 60 * 60 * 1000,
      keys: ['akndandkfsdm'],
   }),
);
app.use(passport.initialize());
app.use(passport.session());

// -------------------------------------------------------------------------------------------------
// Middleware
// -------------------------------------------------------------------------------------------------
app.use(mwareCORS); // Allow CORS
app.use(express.json()); // Parse json
app.use(mwareAuth); // Checks authorization if required

// -------------------------------------------------------------------------------------------------
// Routes
// -------------------------------------------------------------------------------------------------
app.use('/api', routes);
app.use(function(req, res, next) {
   res.status(404).send("Sorry can't find that!");
});

// -------------------------------------------------------------------------------------------------
// Express server
// -------------------------------------------------------------------------------------------------
app.listen(configServer.port, () => {
   console.log(`Server http://localhost:${configServer.port}`);
});
