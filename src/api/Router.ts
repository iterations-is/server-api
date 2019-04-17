/**
 * @file API Router - Main file for API routing
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { mwPermissionsGlobal } from '@middlewares/permissions.mw';
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
import { mwEmpty } from '@middlewares/api/empty.mw';

const express = require('express');
const router = express.Router();

router.get('/orm', mwEmpty);

// Dashboard
// -------------------------------------------------------------------------------------------------
router.get('/dashboard/roles', mwPermissionsGlobal([]), mwGetGlobalRoles);
router.patch('/dashboard/role', mwPermissionsGlobal([]), mwPatchUserGlobalRole);

// Notifications
// -------------------------------------------------------------------------------------------------
router.get('/notifications', mwPermissionsGlobal([]), mwGetUserNotifications);

// Notification
// -------------------------------------------------------------------------------------------------
router.patch('/notification/:id_notification', mwPermissionsGlobal([]), mwPatchNotificationsRead);
router.delete('/notification/:id_notification', mwPermissionsGlobal([]), mwDeleteNotification);

// Ping
// -------------------------------------------------------------------------------------------------
router.get('/ping/auth/with', mwPermissionsGlobal([]), mwPingWithAuth);
router.get('/ping/auth/without', mwPermissionsGlobal([]), mwPingWithoutAuth);

// Projects
// -------------------------------------------------------------------------------------------------
router.use('/projects', mwPermissionsGlobal([]), routerProjects);

// Project
// -------------------------------------------------------------------------------------------------
router.use('/project', mwPermissionsGlobal([]), routerProject);

// Token
// -------------------------------------------------------------------------------------------------
router.get('/token/temporary', mwPermissionsGlobal([]), mwGetTokenTemporary);
router.get('/token/persistent', mwPermissionsGlobal([]), mwGetTokenPersistent);
router.get('/token/verify', mwPermissionsGlobal([]), mwVerifyTokenPersistent);

export default router;
