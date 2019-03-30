/**
 * @file API Router - Main file for API routing
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import routeNotification from './notification.router';
import routeNotifications from './notifications.router';
import routePing from './ping.router';
import routeProjects from './projects.router';
import routerToken from './token.router';

const express = require('express');
const router = express.Router();

router.use('/notification', routeNotification);
router.use('/notifications', routeNotifications);
router.use('/ping', routePing);
router.use('/projects', routeProjects);
router.use('/token', routerToken);

export default router;
