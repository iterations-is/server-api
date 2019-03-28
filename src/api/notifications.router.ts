/**
 * @file Notifications API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import permissions from '@middlewares/permissions.mw';
import { getConnection } from '@utils/typeorm.util';
import { Users } from '@modelsSQL/Users.model';
import { Notifications } from '@modelsSQL/Notifications.model';
import { genResponseSuccessData } from '@utils/response.util';

const express = require('express');
const router = express.Router();

// -------------------------------------------------------------------------------------------------
// Routes
// -------------------------------------------------------------------------------------------------

router.get('/', permissions(['notifications.management']), getUserNotifications);
export default router;

// -------------------------------------------------------------------------------------------------
// Methods
// -------------------------------------------------------------------------------------------------

/**
 * Get all user notifications
 * @param req
 * @param res
 */
async function getUserNotifications(req, res) {
   const connection = getConnection();
   const repoUsers = connection.getRepository(Users);
   const repoNotifications = connection.getRepository(Notifications);

   const user = await repoUsers.findOne(req.jwt.user_id);

   const notifications = await repoNotifications.find({
      where: {
         user: user,
      },
   });

   res.json(genResponseSuccessData('User notifications', notifications));
}
