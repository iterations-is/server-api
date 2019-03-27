/**
 * @file Global permissions middleware
 * @description Checks if user has required permissions
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getManager } from 'typeorm';
import { genResponseErrorSimple } from '@utils/response.util';

export default (permissions: string[]) => {
   return async (req, res, next) => {
      // Check if user with ID req.jwt.id has required permissions

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
         `SELECT * FROM view_user_permissions WHERE user_id=${req.jwt.user_id}`,
      );

      let permissionsPure: string[] = [];

      permissionsView.forEach((item: object) => {
         permissionsPure.push(item['permission_namespace'] + '.' + item['key_namespace']);
      });

      // Check if user have all required permissions
      for (let i = 0; i < permissions.length; i++)
         if (permissionsPure.indexOf(permissions[i]) === -1)
            return res.status(403).json(genResponseErrorSimple('Forbidden'));

      return next();
   };
};