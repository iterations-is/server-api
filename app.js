// -------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------
// Import external
const express = require('express');
// Import configs
const configServer = require('./config/server.config');
// Import middleware
const mwareCORS = require('./middlewares/cors.mw');
const mwareAuth = require('./middlewares/auth.mw');
// Import parts
const routes = require('./router');

// -------------------------------------------------------------------------------------------------
// Application
// -------------------------------------------------------------------------------------------------
const app = express();

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
