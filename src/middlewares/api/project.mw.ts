/**
 * @file Project
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { responseData, responseInvalidData, responseSimple } from '@utils/response.util';
import { validateRequestJoi } from '@utils/validator.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';

const joi = require('joi');

/**
 * Delete project
 * @param req
 * @param res
 * @param next
 */
export const mwDeleteProject = async (req, res, next) => {
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
   if (!isValidRequest) return responseInvalidData(res, 422, 'Invalid data.', verbose);

   const repoProjects = getConnection().getRepository(ProjectsModel);

   try {
      let project = await repoProjects.findOneOrFail(req.params.id_project);
      // await repoProjects.remove(project);
      project.isDeleted = true;
      await repoProjects.save(project);

      return responseSimple(res, 200, 'Project was deleted.');
   } catch (e) {
      return responseData(res, 404, 'Project not found.', { id: req.params.id_project });
   }

   // TODO project full delete
   // Remove project-tags
   // Remove ...
};
