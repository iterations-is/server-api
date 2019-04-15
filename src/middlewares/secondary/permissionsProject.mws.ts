/**
 * @file Store project permissions at req.mw
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { UsersModel } from '@modelsSQL/Users.model';

export const mwsStoreProjectPermissionsLevel = async (req, res, next) => {
   const connection = getConnection();
   const repoUsers = connection.getRepository(UsersModel);

   // User project permissions (all)
   let userWithPermissions = await repoUsers.findOneOrFail({
      where: {
         id: req.jwt.userId,
      },
      relations: ['projectRoles'],
   });

   // Check if user has permissions in the project
   let level = 'nobody';

   for (let projectRole of userWithPermissions['projectRoles']) {
      if (`${projectRole.projectId}` === req.params.id_project) {
         switch (projectRole.name) {
            case 'Leader':
               level = 'leader';
               break;

            case 'Visitors':
               level = 'visitor';
               break;

            default:
               level = 'contributor';
               break;
         }

         break;
      }
   }

   req.project = {
      permissions: level,
   };

   next();
};
