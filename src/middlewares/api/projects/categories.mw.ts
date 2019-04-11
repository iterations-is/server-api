/**
 * @file Project Categories
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { ProjectCategoriesModel } from '@modelsSQL/ProjectCategories.model';
import { responseData, responseInvalidData, responseSimple } from '@utils/response.util';
import { validateRequestJoi } from '@utils/validator.util';

const joi = require('joi');

/**
 * @desc Get all project categories
 * @param req
 * @param res
 * @param next
 */
export const mwGetProjectCategories = async (req, res, next) => {
   const connection = getConnection();
   const repoProjectCategories = connection.getRepository(ProjectCategoriesModel);

   try {
      const categories = await repoProjectCategories.find();
      return responseData(res, 200, 'Project categories.', { categories });
   } catch (e) {
      return responseSimple(res, 500, 'Cannot get project categories.');
   }
};

/**
 * Create project category
 * @param req
 * @param res
 * @param next
 */
export const mwCreateProjectCategory = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         name: joi
            .string()
            .min(1)
            .max(40)
            .required(),
      }),
      params: null,
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoProjectCategories = connection.getRepository(ProjectCategoriesModel);

   const category = new ProjectCategoriesModel();
   category.name = req.body.name;

   try {
      await repoProjectCategories.save(category);
      return responseData(res, 200, 'Category was created.', { name: category.name });
   } catch (e) {
      return responseData(res, 409, 'Cannot create category.', { name: category.name });
   }
};
