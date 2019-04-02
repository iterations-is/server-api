/**
 * @file Notification
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { NotificationsModel } from '@modelsSQL/Notifications.model';
import { responseData, responseInvalidData, responseSimple } from '@utils/response.util';
import { validateRequestJoi } from '@utils/validator.util';

const joi = require('joi');

/**
 * Patch notification read status
 * @param req
 * @param res
 * @param next
 */
export const mwPatchNotificationsRead = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: null,
      params: joi.object().keys({
         id_notification: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseInvalidData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoNotifications = connection.getRepository(NotificationsModel);

   // Try to change user notification
   try {
      const notification = await repoNotifications.findOneOrFail(req.params.id_notification);
      // Current user is not the owner
      if (notification.userId !== req.jwt.user_id)
         return responseInvalidData(res, 403, 'Forbidden', []);

      // Patch
      notification.isRead = !notification.isRead;
      await repoNotifications.save(notification);

      return responseData(res, 200, 'Read status changed.', {
         isRead: notification.isRead,
      });
   } catch (e) {
      return responseInvalidData(res, 403, 'Forbidden', []);
   }
};

/**
 * Delete notification
 * @param req
 * @param res
 * @param next
 */
export const mwDeleteNotification = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: null,
      params: joi.object().keys({
         id_notification: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseInvalidData(res, 422, 'Invalid data.', verbose);
   const connection = getConnection();
   const repoNotifications = connection.getRepository(NotificationsModel);

   // Try to remove user notification
   try {
      const notification = await repoNotifications.findOneOrFail(req.params.id_notification);
      // Current user is not the owner
      if (notification.userId !== req.jwt.user_id)
         return responseInvalidData(res, 403, 'Forbidden', []);

      // Delete
      await repoNotifications.remove(notification);

      return responseSimple(res, 200, 'Notification was removed.');
   } catch (e) {
      return responseInvalidData(res, 403, 'Forbidden', []);
   }
};
