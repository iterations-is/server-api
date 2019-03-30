/**
 * @file Project Category
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { Projects } from '@modelsSQL/Projects';
import { ProjectCategories } from '@modelsSQL/ProjectCategories.model';
import { responseData, responseInvalidData, responseSimple } from '@utils/response.util';
import { validateRequestJoi } from '@utils/validator.util';

const joi = require('joi');

/**
 * Patch project category
 * @param req
 * @param res
 * @param next
 */
export const mwPatchProjectCategory = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         name: joi
            .string()
            .min(1)
            .max(40)
            .required(),
      }),
      params: joi.object().keys({
         id_category: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseInvalidData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoProjectCategories = connection.getRepository(ProjectCategories);

   let category;
   try {
      category = await repoProjectCategories.findOneOrFail(req.params.id_category);
   } catch (e) {
      return responseSimple(res, 404, 'Not found.');
   }

   try {
      category.name = req.body.name;
      await repoProjectCategories.save(category);
      return responseData(res, 200, 'Category was patched.', { name: req.body.name });
   } catch (e) {
      return responseSimple(res, 409, 'Cannot patch category.');
   }
};

/**
 * Delete project category
 * @param req
 * @param res
 * @param next
 */
export const mwDeleteProjectCategory = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: null,
      params: joi.object().keys({
         id_category: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseInvalidData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoProjects = connection.getRepository(Projects);
   const repoProjectCategories = connection.getRepository(ProjectCategories);

   let category;
   try {
      category = await repoProjectCategories.findOneOrFail(req.params.id_ctegory);
   } catch (e) {
      return responseSimple(res, 404, 'Not found.');
   }

   try {
      const projectsInCategory = await repoProjects.find({
         where: {
            fk__categories_id: req.params.id_ctegory,
         },
      });

      if (projectsInCategory.length !== 0)
         return responseSimple(res, 409, 'Cannot remove category. At least one project uses it.');
   } catch (e) {
      return responseSimple(res, 500, 'Cannot remove project categories.');
   }

   try {
      await repoProjectCategories.remove(category);
      return responseSimple(res, 200, 'Project category was removed.');
   } catch (e) {
      return responseSimple(res, 500, 'Cannot remove project categories.');
   }
};
