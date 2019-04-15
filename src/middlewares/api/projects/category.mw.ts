/**
 * @file Project Category
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';
import { ProjectCategoriesModel } from '@modelsSQL/ProjectCategories.model';
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
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoProjectCategories = connection.getRepository(ProjectCategoriesModel);

   let category;
   try {
      category = await repoProjectCategories.findOneOrFail(req.params.id_category);
   } catch (e) {
      return responseSimple(res, 404, 'Not found.');
   }

   try {
      const old = category.name;
      category.name = req.body.name;
      await repoProjectCategories.save(category);
      return responseData(res, 200, 'Category was patched.', {
         oldName: old,
         newName: category.name,
      });
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
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoProjectCategories = connection.getRepository(ProjectCategoriesModel);

   let category;
   try {
      category = await repoProjectCategories.findOneOrFail(req.params.id_category);
   } catch (e) {
      return responseSimple(res, 404, 'Not found.');
   }

   try {
      await repoProjectCategories.remove(category);
      return responseSimple(res, 200, 'Project category was removed.');
   } catch (e) {
      return responseSimple(
         res,
         500,
         'Cannot remove project category. At least one project uses it.',
      );
   }
};
