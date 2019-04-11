/**
 * @file Projects
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { responseData, responseInvalidData, responseSimple } from '@utils/response.util';
import { validateRequestJoi } from '@utils/validator.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';
import { ProjectCategoriesModel } from '@modelsSQL/ProjectCategories.model';
import logger from '@utils/logger.util';
import { UsersModel } from '@modelsSQL/Users.model';

const joi = require('joi');

/**
 * Create project
 * @param req
 * @param res
 * @param next
 */
export const mwCreateProject = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: null,
      params: null,
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseInvalidData(res, 422, 'Invalid data.', verbose);

   // MW Store
   req.iterations = {};
   req.iterations.createProject = {};

   // Models
   const connection = getConnection();
   const repoUsers = connection.getRepository(UsersModel);
   const repoProjectCategories = connection.getRepository(ProjectCategoriesModel);

   // Find user creator
   req.iterations.createProject.user = null;
   try {
      req.iterations.createProject.user = await repoUsers.findOneOrFail({
         where: {
            id: req.jwt.userId,
         },
      });
   } catch (e) {
      return responseSimple(res, 409, 'Cannot find a user.');
   }

   // Find category
   let category = null;
   try {
      category = await repoProjectCategories.findOneOrFail({
         where: {
            id: req.body.categoryId,
         },
      });
   } catch (e) {
      return responseData(res, 409, 'Cannot find a category.', {
         categoryId: req.params.categoryId,
      });
   }

   // Create project
   const project = new ProjectsModel();
   project.name = req.body.name;
   project.descriptionPublic = req.body.descriptionPublic;
   project.descriptionPrivate = req.body.descriptionPrivate;
   project.isArchived = false;
   project.isDeleted = false;
   project.isSearchable = req.body.isSearchable;
   project.isPublic = req.body.isPublic;
   project.category = category;

   req.iterations.createProject.project = project;

   return next();
};

export const mwCreateProjectTransaction = async (req, res, next) => {
   try {
      await getConnection().transaction(async transactionalEntityManager => {
         // Project
         await transactionalEntityManager.save(req.iterations.createProject.project);
         // Roles
         await transactionalEntityManager.save(req.iterations.createProject.roleLeaders);
         await transactionalEntityManager.save(req.iterations.createProject.roleVisitors);
         // Iterations
         await transactionalEntityManager.save(req.iterations.createProject.iterations);
         // Tasks
         await transactionalEntityManager.save(req.iterations.createProject.tasks);
      });

      return responseData(res, 200, 'Project was created.', {});
   } catch (e) {
      logger.error(e);

      return responseData(res, 409, 'Cannot create a project.', {});
   }
};
