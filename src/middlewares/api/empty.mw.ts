/**
 * @file Empty
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { responseData, responseSimple } from '@utils/response.util';
import { getConnection } from '@utils/typeorm.util';
import { UsersModel } from '@modelsSQL/Users.model';
import { ProjectsModel } from '@modelsSQL/Projects.model';

enum ProjectRole {
   VISITOR,
   CONTRIBUTOR,
   LEADER,
}

export const mwEmpty = async (req, res, next) => {
   const connection = getConnection();
   const repoProject = connection.getRepository(ProjectsModel);
};
