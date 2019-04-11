/**
 * @file Global permissions middleware
 * @description Checks if user has required permissions
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 * @example
 * import permissions from '@middlewares/permissions.mw';
 * router.get('/path', permissions(['namespace.key_permission'], (req, res) => {}));
 */

import { getManager } from '@utils/typeorm.util';
import { responseSimple } from '@utils/response.util';

export default (permissions: string[]) => {
   return async (req, res, next) => {
      // Check if user with ID req.jwt.userId has required permissions
      if (permissions.length === 0) return next();

      /*
       * [
       *    {
       *       "user_id": 3,
       *       "permission_namespace": "account",
       *       "key_namespace": "view_private_information"
       *    },
       * ]
       */
      const permissionsView: object[] = await getManager().query(
         `SELECT * FROM view_user_permissions WHERE user_id=${req.jwt.userId}`,
      );

      let permissionsPure: string[] = [];

      permissionsView.forEach((item: object) => {
         permissionsPure.push(item['permission_namespace'] + '.' + item['key_namespace']);
      });

      // Check if user have all required permissions
      for (let i = 0; i < permissions.length; i++)
         if (permissionsPure.indexOf(permissions[i]) === -1)
            return responseSimple(res, 403, 'Forbidden');

      return next();
   };
};
