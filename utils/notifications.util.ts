/**
 * @file Notifications
 * @description
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from 'typeorm';
import { Notifications } from '@sqlmodels/Notifications.model';
import { Users } from '@sqlmodels/Users.model';
import logger from '@utils/logger.util';

const repoNotifications = getConnection().getRepository(Notifications);

export const createNotificationForUsers = async (message: string, users_id: Users[]) => {
   let notifications: Notifications[] = [];

   users_id.forEach((user_id: Users) => {
      const notification = new Notifications();
      notification.message = message;
      notification.isRead = false;
      notification.user = user_id;
      notifications.push(notification);
   });

   await repoNotifications.save(notifications);
};

logger.debug('Utility:Notifications start.');
