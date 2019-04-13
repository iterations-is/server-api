/**
 * @file API Router - Main file for API routing
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import permissions from '@middlewares/permissions.mw';
import { mwGetGlobalRoles, mwPatchUserGlobalRole } from '@middlewares/api/dashboard.mw';
import { mwPingWithAuth, mwPingWithoutAuth } from '@middlewares/api/ping.mw';
import { mwDeleteNotification, mwPatchNotificationsRead } from '@middlewares/api/notification.mw';
import { mwGetUserNotifications } from '@middlewares/api/notifications.mw';
import {
   mwGetTokenPersistent,
   mwGetTokenTemporary,
   mwVerifyTokenPersistent,
} from '@middlewares/api/token.mw';

import routerProject from './project.route';
import routerProjects from './projects.route';

const express = require('express');
const router = express.Router();

// Dashboard
// -------------------------------------------------------------------------------------------------
router.get('/dashboard/roles', permissions([]), mwGetGlobalRoles);
router.patch('/dashboard/role', permissions([]), mwPatchUserGlobalRole);

// Notifications
// -------------------------------------------------------------------------------------------------
router.get('/notifications', permissions([]), mwGetUserNotifications);

// Notification
// -------------------------------------------------------------------------------------------------
router.patch('/notification/:id_notification', permissions([]), mwPatchNotificationsRead);
router.delete('/notification/:id_notification', permissions([]), mwDeleteNotification);

// Ping
// -------------------------------------------------------------------------------------------------
router.get('/ping/auth/with', permissions([]), mwPingWithAuth);
router.get('/ping/auth/without', permissions([]), mwPingWithoutAuth);

// Projects
// -------------------------------------------------------------------------------------------------
router.use('/projects', permissions([]), routerProjects);

// Project
// -------------------------------------------------------------------------------------------------
router.use('/project', permissions([]), routerProject);

// Token
// -------------------------------------------------------------------------------------------------
router.get('/token/temporary', permissions([]), mwGetTokenTemporary);
router.get('/token/persistent', permissions([]), mwGetTokenPersistent);
router.get('/token/verify', permissions([]), mwVerifyTokenPersistent);

export default router;
