/**
 * @file Notifications
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { Notifications } from '@modelsSQL/Notifications.model';
import { Users } from '@modelsSQL/Users.model';
import { responseData, responseSimple } from '@utils/response.util';

/**
 * Get all user notifications
 * @param req
 * @param res
 * @param next
 */
export const mwGetUserNotifications = async (req, res, next) => {
   const connection = getConnection();
   const repoUsers = connection.getRepository(Users);
   const repoNotifications = connection.getRepository(Notifications);

   try {
      const user = await repoUsers.findOne(req.jwt.user_id);
      const notifications = await repoNotifications.find({
         where: {
            user: user,
         },
      });

      return responseData(res, 200, 'User notifications', { notifications });
   } catch (e) {
      return responseSimple(res, 500, 'Cannot get user notifications.');
   }
};
