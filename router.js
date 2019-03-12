/**
 * @file Router - Define all routes from the root "/", required in app.js
 * @author Sergey Dunaevskiy
 */

const express = require('express');
const router = express.Router();

const routePing = require('./routes/ping.router');
const routeAuth = require('./routes/auth.router');

// Routes
router.use('/login', routeAuth);
router.use('/ping', routePing);

module.exports = router;
