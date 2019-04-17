/**
 * @file Global permissions middleware
 * @description Checks if user has required permissions
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 * @example
 * import permissions from '@middlewares/permissions.mw';
 * router.get('/path', permissions(['namespace.key_permission'], (req, res) => {}));
 */

import { getConnection, getManager } from '@utils/typeorm.util';
import { responseData, responseInvalidData, responseSimple } from '@utils/response.util';
import { UsersModel } from '@modelsSQL/Users.model';

export enum UserProjectRole {
   NOBODY = 'NOBODY',
   VISITOR = 'VISITOR',
   CONTRIBUTOR = 'CONTRIBUTOR',
   LEADER = 'LEADER',
}

/**
 * Check if current user (from JWT) has requested permissions
 * @param permissions Array of required permissions
 */
export const mwPermissionsGlobal = (permissions: string[]) => {
   return async (req, res, next) => {
      // Check if user with ID req.jwt.userId has required permissions
      if (permissions.length === 0) return next();

      // Get user permissions {namespace: "", key: ""}
      const permissionsView: object[] = await getManager().query(
         `SELECT * FROM view_user_permissions WHERE user_id=${req.jwt.userId}`,
      );

      // Create array ["namespace.key", ...] with user permissions
      let permissionsPure: string[] = [];
      permissionsView.forEach((item: object) => {
         permissionsPure.push(item['permission_namespace'] + '.' + item['key_namespace']);
      });

      // Check if user have all required permissions
      for (let i = 0; i < permissions.length; ++i)
         if (permissionsPure.indexOf(permissions[i]) === -1)
            return responseData(res, 403, 'Forbidden', ['Not enough rights to call this action.']);

      return next();
   };
};

/**
 * Check if current user (from JWT) has enough project rights
 * @param allowedRoles Array of roles that have enough right to call API
 */
export const mwPermissionsProject = (allowedRoles: UserProjectRole[]) => {
   return async (req, res, next) => {
      // Deduce user project role
      // -------------------------------------------------------------------------------------------

      // Get user project role
      const connection = getConnection();
      const userWithProjectRole = await connection
         .getRepository(UsersModel)
         .createQueryBuilder('user')
         .innerJoinAndSelect('user.projectRoles', 'roles')
         .where('roles.projectId = :idProject AND user.id = :idUser', {
            idProject: req.params.id_project,
            idUser: req.jwt.userId,
         })
         .getOne();

      // Map user role to group
      let userLevel: UserProjectRole;
      if (userWithProjectRole === undefined) {
         userLevel = UserProjectRole.NOBODY;
      } else {
         switch (userWithProjectRole.projectRoles[0].name) {
            case 'Leader':
               userLevel = UserProjectRole.LEADER;
               break;
            case 'Visitors':
               userLevel = UserProjectRole.VISITOR;
               break;
            default:
               userLevel = UserProjectRole.CONTRIBUTOR;
         }
      }

      // Payload
      if (!req.payload) req.payload = {};
      req.payload.userProjectRole = userLevel;

      // Decide if pass test or fail
      // -------------------------------------------------------------------------------------------
      // Everyone have an access
      if (allowedRoles.length === 0) return next();

      // User doesnt have enough rights
      if (allowedRoles.indexOf(userLevel) === -1)
         responseInvalidData(res, 403, 'Forbidden', ['Not enough rights to edit the project.']);

      // Next
      return next();
   };
};

export const mwPermissionsIsAuthority = async (req, res, next) => {
   const connection = getConnection();
   const repoUsers = connection.getRepository(UsersModel);
   const user = await repoUsers.findOneOrFail({
      where: {
         id: req.jwt.userId,
      },
      relations: ['role'],
   });

   // Payload
   if (!req.payload) req.payload = {};
   req.payload.userIsAuthority = user.role.isAuthority;

   // Next
   return next();
};
