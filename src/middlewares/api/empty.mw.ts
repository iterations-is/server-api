/**
 * @file Empty
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { responseData, responseSimple } from '@utils/response.util';
import { getConnection } from '@utils/typeorm.util';
import { UsersModel } from '@modelsSQL/Users.model';

enum ProjectRole {
   VISITOR,
   CONTRIBUTOR,
   LEADER,
}

export const mwEmpty = async (req, res, next) => {
   const connection = getConnection();
   const response = await connection.getRepository(UsersModel).findOneOrFail({
      where: {
         id: req.jwt.userId,
      },
      relations: ['role'],
   });

   return responseData(res, 200, 'Empty.', response);
};
