/**
 * @file API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { genResponseErrorDataInvalid, genResponseSuccessData } from '@utils/response.util';
import permissions from '@middlewares/permissions.mw';
import { getConnection } from '@utils/typeorm.util';
import { ProjectCategories } from '@modelsSQL/ProjectCategories.model';
import { validateViaJoiSchema } from '@utils/validator.util';

const express = require('express');
const router = express.Router();
const joi = require('joi');

// -------------------------------------------------------------------------------------------------
// Routes
// -------------------------------------------------------------------------------------------------

router.get('/', getCategories);
router.post('/', permissions(['category.create']), createCategory);
export default router;

// -------------------------------------------------------------------------------------------------
// Methods
// -------------------------------------------------------------------------------------------------

/**
 * @desc Get all categories
 * @param req
 * @param res
 */
async function getCategories(req, res) {
   const connection = getConnection();
   const repoProjectCategories = connection.getRepository(ProjectCategories);
   const categories = await repoProjectCategories.find();
   res.json(genResponseSuccessData('Project categories', { categories }));
}

/**
 * @desc Create category
 * @param req
 * @param res
 */
async function createCategory(req, res) {
   // Schemas
   const schemaBody = joi.object().keys({
      name: joi
         .string()
         .min(1)
         .max(40)
         .required(),
   });

   // Validation
   if (!validateViaJoiSchema(req.body, schemaBody))
      return res.status(422).json(genResponseErrorDataInvalid('Invalid data', []));

   // Connection repository example
   const connection = getConnection();
   const repoProjectCategories = connection.getRepository(ProjectCategories);

   let category = new ProjectCategories();
   category.name = req.body.name;

   // Try to create category
   try {
      await repoProjectCategories.save(category);
   } catch (e) {
      return res.status(409).json(
         genResponseErrorDataInvalid('Cannot create category.', [''], {
            name: category.name,
         }),
      );
   }

   return res.status(200).json(
      genResponseSuccessData('Category was created.', {
         name: category.name,
      }),
   );
}
