/**
 * @file Notifications API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import permissions from '@middlewares/permissions.mw';
import { mwGetUserNotifications } from '@middlewares/api/notifications.mw';

const express = require('express');
const router = express.Router();

router.get('/', permissions(['notifications.management']), mwGetUserNotifications);
export default router;
