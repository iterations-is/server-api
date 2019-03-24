/**
 * @file API Router - Main file for API routing
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

export {};
const express = require('express');
const router = express.Router();

const routeAuth = require('./auth.router');
const routeNotifications = require('./notifications.router');
const routePing = require('./ping.router');

// API routes
router.use('/auth', routeAuth);
router.use('/notifications', routeNotifications);
router.use('/ping', routePing);

module.exports = router;
