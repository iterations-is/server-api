/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Users } from '@modelsSQL/Users.model';
import { getConnection } from '@utils/typeorm.util';
import { Notifications } from '@modelsSQL/Notifications.model';

/**
 * Create notification for group of users
 * @param message
 * @param users
 */
export const dbCreateNotifications = async (message: string, users: Users[]) => {
   const connection = getConnection();
   const repoNotifications = connection.getRepository(Notifications);

   let notificationsToCreate: Notifications[] = [];

   users.forEach((user: Users) => {
      const notification = new Notifications();
      notification.message = message;
      notification.isRead = false;
      notification.user = user;
      notificationsToCreate.push(notification);
   });

   try {
      await repoNotifications.save(notificationsToCreate);

      return true;
   } catch (e) {
      return false;
   }
};
