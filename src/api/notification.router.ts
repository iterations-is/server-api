/**
 * @file Notifications API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import permissions from '@middlewares/permissions.mw';
import { validateViaJoiSchema } from '@utils/validator.util';
import { getConnection } from '@utils/typeorm.util';
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

router.patch('/:id_notification', permissions(['notifications.management']), patchReadStatus);
router.delete('/:id_notification', permissions(['notifications.management']), deleteNotification);
export default router;

// -------------------------------------------------------------------------------------------------
// Methods
// -------------------------------------------------------------------------------------------------

/**
 * Patch notification read status
 * @param req
 * @param res
 */
async function patchReadStatus(req, res) {
   // Schemas
   const schemaParams = joi.object().keys({
      id_notification: joi
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

   // Try to change user notification
   try {
      const notification = await repoNotifications.findOneOrFail(req.params.id_notification);
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
      id_notification: joi
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

   // Try to change user notification
   try {
      const notification = await repoNotifications.findOneOrFail(req.params.id_notification);
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
