/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { validateRequestJoi } from '@utils/validator.util';
import { responseData } from '@utils/response.util';
import { getConnection } from '@utils/typeorm.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';
import { tags } from 'joi';

const joi = require('joi');

export const mwGetProjectMetadata = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: null,
      params: joi.object().keys({
         id_project: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoProjectCategories = connection.getRepository(ProjectsModel);

   try {
      const metadataPublic = await repoProjectCategories.findOneOrFail(req.params.id_project, {
         select: [
            'id',
            'name',
            'descriptionPublic',
            'isArchived',
            'isPublic',
            'hasOpenVacancies',
            'isSearchable',
            'createdAt',
         ],
         relations: ['tags', 'category'],
      });
      return responseData(res, 200, 'Project metadata.', { public: metadataPublic });
   } catch (e) {
      return responseData(res, 409, 'Cannot get metadata.', { e });
   }
};
