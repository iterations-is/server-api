/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { UsersModel } from '@modelsSQL/Users.model';
import { getConnection } from '@utils/typeorm.util';
import { NotificationsModel } from '@modelsSQL/Notifications.model';

/**
 * Create notification for group of users
 * @param message
 * @param users
 */
export const dbCreateNotifications = async (message: string, users: UsersModel[]) => {
   const connection = getConnection();
   const repoNotifications = connection.getRepository(NotificationsModel);

   let notificationsToCreate: NotificationsModel[] = [];

   users.forEach((user: UsersModel) => {
      const notification = new NotificationsModel();
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
