/**
 * @file API Router - Main file for API routing
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import routerAuthorization from './auth.router';
import routeNotification from './notification.router';
import routeNotifications from './notifications.router';
import routePing from './ping.router';
import routeProjects from './projects.router';

const express = require('express');
const router = express.Router();

// API routes
router.use('/auth', routerAuthorization);
router.use('/notification', routeNotification);
router.use('/notifications', routeNotifications);
router.use('/ping', routePing);
router.use('/projects', routeProjects);

export default router;
