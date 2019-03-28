/**
 * @file API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   genResponseErrorDataInvalid,
   genResponseSuccessData,
   genResponseSuccessSimple,
} from '@utils/response.util';
import { validateViaJoiSchema } from '@utils/validator.util';
import permissions from '@middlewares/permissions.mw';
import { getConnection } from '@utils/typeorm.util';
import { ProjectCategories } from '@modelsSQL/ProjectCategories.model';
import { Projects } from '@modelsSQL/Projects';

const express = require('express');
const router = express.Router();
const joi = require('joi');

// -------------------------------------------------------------------------------------------------
// Routes
// -------------------------------------------------------------------------------------------------

router.patch('/:id_category', permissions(['category.edit']), updateCategory);
router.delete('/:id_category', permissions(['category.remove']), removeCategory);
export default router;

// -------------------------------------------------------------------------------------------------
// Methods
// -------------------------------------------------------------------------------------------------

/**
 * @desc
 * @param req
 * @param res
 */
async function updateCategory(req, res) {
   // Schema
   const schemaParams = joi.object().keys({
      id_category: joi
         .number()
         .min(0)
         .required(),
   });

   const schemaBody = joi.object().keys({
      name: joi
         .string()
         .min(1)
         .max(40)
         .required(),
   });

   // Validation
   if (
      !validateViaJoiSchema(req.params, schemaParams) ||
      !validateViaJoiSchema(req.body, schemaBody)
   )
      return res.status(422).json(genResponseErrorDataInvalid('Invalid data', []));

   // DB
   const connection = getConnection();
   const repoProjectCategories = connection.getRepository(ProjectCategories);

   // Try to change category
   try {
      const category = await repoProjectCategories.findOneOrFail(req.params.id_category);
      category.name = req.body.name;
      await repoProjectCategories.save(category);
   } catch (e) {
      return res.status(409).json(
         genResponseErrorDataInvalid('Cannot change category.', [''], {
            name: req.body.name,
            error: e,
         }),
      );
   }

   return res.status(200).send(
      genResponseSuccessData('Category name was changed.', {
         name: req.body.name,
      }),
   );
}

/**
 * @desc Remove category
 * @param req
 * @param res
 */
async function removeCategory(req, res) {
   // Schema
   const schemaParams = joi.object().keys({
      id_category: joi
         .number()
         .min(0)
         .required(),
   });

   // Validation
   if (!validateViaJoiSchema(req.params, schemaParams))
      return res.status(422).json(genResponseErrorDataInvalid('Invalid data', []));

   // DB
   const connection = getConnection();
   const repoProjects = connection.getRepository(Projects);
   const repoProjectCategories = connection.getRepository(ProjectCategories);

   // Try to change category
   try {
      const category = await repoProjectCategories.findOneOrFail(req.params.id_category);
      const projectsInCategory = await repoProjects.find({
         where: {
            fk__categories_id: req.params.id_category,
         },
      });

      if (projectsInCategory.length !== 0) {
         return res.status(409).json(
            genResponseErrorDataInvalid('Cannot remove category.', [''], {
               id: req.params.id_category,
            }),
         );
      }
      await repoProjectCategories.remove(category);
   } catch (e) {
      return res.status(409).json(
         genResponseErrorDataInvalid('Cannot remove category.', [''], {
            id: req.params.id_category,
         }),
      );
   }

   return res.status(200).send(genResponseSuccessSimple('Category was removed.'));
}
