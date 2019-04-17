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

// Global Roles
// -------------------------------------------------------------------------------------------------
router.get(
   '/roles',
   mwPermissionsGlobal(['global_roles.get']),
   mwGetGlobalRoles,
   //
);
router.patch(
   '/role',
   mwPermissionsGlobal(['global_roles.edit']),
   mwPatchUserGlobalRole,
   //
);

// Notifications
// -------------------------------------------------------------------------------------------------
router.get(
   '/notifications',
   mwPermissionsGlobal(['notifications.get']),
   mwGetUserNotifications,
   //
);

// Notification
// -------------------------------------------------------------------------------------------------
router.patch(
   '/notification/:id_notification',
   mwPermissionsGlobal(['notifications.edit']),
   mwPatchNotificationsRead,
   //
);
router.delete(
   '/notification/:id_notification',
   mwPermissionsGlobal(['notifications.edit']),
   mwDeleteNotification,
   //
);

// Ping
// -------------------------------------------------------------------------------------------------
router.get(
   '/ping/auth/with',
   mwPingWithAuth,
   //
);
router.get(
   '/ping/auth/without',
   mwPingWithoutAuth,
   //
);

// Projects
// -------------------------------------------------------------------------------------------------
router.use(
   '/projects',
   mwPermissionsGlobal(['projects.manage']),
   routerProjects,
   //
);

// Project
// -------------------------------------------------------------------------------------------------
router.use(
   '/project',
   mwPermissionsGlobal(['projects.manage']),
   routerProject,
   //
);

// Token
// -------------------------------------------------------------------------------------------------
router.get(
   '/token/temporary',
   mwGetTokenTemporary,
   //
);
router.get(
   '/token/persistent',
   mwGetTokenPersistent,
   //
);
router.get(
   '/token/verify',
   mwVerifyTokenPersistent,
   //
);

export default router;
