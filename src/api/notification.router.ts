/**
 * @file Notification API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import permissions from '@middlewares/permissions.mw';
import { mwDeleteNotification, mwPatchNotificationsRead } from '@middlewares/api/notification.mw';

const express = require('express');
const router = express.Router();

router.patch(
   '/:id_notification',
   permissions(['notifications.management']),
   mwPatchNotificationsRead,
);
router.delete('/:id_notification', permissions(['notifications.management']), mwDeleteNotification);
export default router;
