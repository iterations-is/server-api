/**
 * @file API Router - Main file for API routing
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

const express = require('express');
const router = express.Router();

const routeAuth = require('./auth.router');
const routePing = require('./ping.router');

// API routes
router.use('/auth', routeAuth);
router.use('/ping', routePing);

module.exports = router;
