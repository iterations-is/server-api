/**
 * @file NotificationsModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { NotificationsModel } from '@modelsSQL/Notifications.model';
import { UsersModel } from '@modelsSQL/Users.model';
import { responseData, responseSimple } from '@utils/response.util';

/**
 * Get all user notifications
 * @param req
 * @param res
 * @param next
 */
export const mwGetUserNotifications = async (req, res, next) => {
   const connection = getConnection();
   const repoUsers = connection.getRepository(UsersModel);
   const repoNotifications = connection.getRepository(NotificationsModel);

   try {
      const user = await repoUsers.findOne(req.jwt.userId);
      const notifications = await repoNotifications.find({
         order: {
            id: 'ASC',
         },
         where: {
            user: user,
         },
      });

      return responseData(res, 200, 'User notifications', { notifications });
   } catch (e) {
      return responseSimple(res, 500, 'Cannot get user notifications.');
   }
};
