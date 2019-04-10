/**
 * @file Global Roles
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { GlobalRolesModel } from '@modelsSQL/GlobalRoles.model';
import { UsersModel } from '@modelsSQL/Users.model';
import { responseData, responseInvalidData, responseSimple } from '@utils/response.util';
import { validateRequestJoi } from '@utils/validator.util';
import { dbCreateNotifications } from '@utils/notifications.util';

const joi = require('joi');

/**
 * Get all global roles
 * @param req
 * @param res
 * @param next
 */
export const mwGetGlobalRoles = async (req, res, next) => {
   const connection = getConnection();
   const repoGlobalRoles = connection.getRepository(GlobalRolesModel);

   try {
      const roles = await repoGlobalRoles.find({
         order: {
            id: 'ASC',
         },
      });

      return responseData(res, 200, 'User notifications', { roles });
   } catch (e) {
      return responseSimple(res, 500, 'Cannot get global roles.');
   }
};

/**
 * Patch user global role
 * @param req
 * @param res
 * @param next
 */
export const mwPatchUserGlobalRole = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         username: joi.string().required(),
         role: joi
            .number()
            .min(0)
            .required(),
      }),
      params: null,
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseInvalidData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoUsers = connection.getRepository(UsersModel);
   const repoGlobalRoles = connection.getRepository(GlobalRolesModel);

   try {
      const role = await repoGlobalRoles.findOneOrFail(req.body.role);
      let user = await repoUsers.findOneOrFail({
         where: {
            authUsername: req.body.username,
         },
      });

      user.role = role;
      await repoUsers.save(user);

      await dbCreateNotifications(`Your global role was changed. You are "${role.name}" now.`, [
         user,
      ]);

      return responseData(res, 200, 'User role was changed.', { user });
   } catch (e) {
      return responseSimple(res, 500, 'Cannot change user role.');
   }
};
