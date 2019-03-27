/**
 * @file Notifications API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import permissions from '@middlewares/permissions.mw';
import { validateViaJoiSchema } from '@utils/validator.util';
import { getConnection } from 'typeorm';
import { Users } from '@modelsSQL/Users.model';
import { Notifications } from '@modelsSQL/Notifications.model';
import {
   genResponseErrorDataInvalid,
   genResponseSuccessData,
   genResponseSuccessSimple,
} from '@utils/response.util';

const express = require('express');
const router = express.Router();
const joi = require('joi');

// -------------------------------------------------------------------------------------------------
// Routes
// -------------------------------------------------------------------------------------------------

router.get('/', permissions(['notifications.management']), getUserNotifications);
router.patch('/:id', permissions(['notifications.management']), patchNotificationReadStatus);
router.delete('/:id', permissions(['notifications.management']), deleteNotification);
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

/**
 * Patch notification read status
 * @param req
 * @param res
 */
async function patchNotificationReadStatus(req, res) {
   // Schemas
   const schemaParams = joi.object().keys({
      id: joi
         .number()
         .min(0)
         .required(),
   });

   // Validation
   if (!validateViaJoiSchema(req.params, schemaParams))
      return res.status(422).json(genResponseErrorDataInvalid('Invalid data', []));

   // DB
   const connection = getConnection();
   const repoNotifications = connection.getRepository(Notifications);
   const notificationID: number = req.params.id;

   // Try to change user notification
   try {
      const notification = await repoNotifications.findOneOrFail(notificationID);
      // Current user is not the owner
      if (notification.users_id !== req.jwt.user_id)
         return res
            .status(403)
            .json(genResponseErrorDataInvalid('Forbidden.', ['invalid notification']));

      // Patch
      notification.isRead = !notification.isRead;
      await repoNotifications.save(notification);

      res.status(200).send(
         genResponseSuccessData('Read status changed.', {
            isRead: notification.isRead,
         }),
      );
   } catch (e) {
      res.status(403).json(genResponseErrorDataInvalid('Forbidden.', ['invalid notification']));
   }
}

/**
 * Delete notification
 * @param req
 * @param res
 */
async function deleteNotification(req, res) {
   // Schema
   const schemaParams = joi.object().keys({
      id: joi
         .number()
         .min(0)
         .required(),
   });

   // Validation
   if (!validateViaJoiSchema(req.params, schemaParams))
      return res.status(422).json(genResponseErrorDataInvalid('Invalid data', []));

   // DB
   const connection = getConnection();
   const repoNotifications = connection.getRepository(Notifications);
   const notificationID: number = req.params.id;

   // Try to change user notification
   try {
      const notification = await repoNotifications.findOneOrFail(notificationID);
      // Current user is not the owner
      if (notification.users_id !== req.jwt.user_id)
         return res
            .status(403)
            .json(genResponseErrorDataInvalid('Forbidden.', ['invalid notification']));

      // Delete
      await repoNotifications.remove(notification);

      res.status(200).send(genResponseSuccessSimple('Notification was removed.'));
   } catch (e) {
      res.status(403).json(genResponseErrorDataInvalid('Forbidden.', ['invalid notification']));
   }
}
