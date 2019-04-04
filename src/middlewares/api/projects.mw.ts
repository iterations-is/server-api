/**
 * @file Projects
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { responseData, responseInvalidData, responseSimple } from '@utils/response.util';
import { validateRequestJoi } from '@utils/validator.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';
import { ProjectCategoriesModel } from '@modelsSQL/ProjectCategories.model';
import { ProjectRolesModel } from '@modelsSQL/ProjectRoles.model';
import logger from '@utils/logger.util';
import { UsersModel } from '@modelsSQL/Users.model';
import { TagsModel } from '@modelsSQL/Tags.model';
import { IterationsModel } from '@modelsSQL/Iterations.model';
import { TasksModel } from '@modelsSQL/Tasks.model';

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

   // TODO Create project

   const connection = getConnection();
   const repoUsers = connection.getRepository(UsersModel);
   const repoTags = connection.getRepository(TagsModel);
   const repoProjectCategories = connection.getRepository(ProjectCategoriesModel);

   // Find user
   let user: UsersModel = null;
   try {
      user = await repoUsers.findOneOrFail({
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

   // Set roles
   const roleLeaders = new ProjectRolesModel();
   roleLeaders.name = 'Leader';
   roleLeaders.isEditable = false;
   roleLeaders.project = project;
   roleLeaders.users = [user];

   const roleVisitors = new ProjectRolesModel();
   roleVisitors.name = 'Visitors';
   roleVisitors.isEditable = false;
   roleVisitors.project = project;

   // Set tags
   const tags: TagsModel[] = [];
   for (let tagName of req.body.tags) {
      let tag = new TagsModel();
      tag.name = tagName;
      tag.projects = [];
      try {
         await repoTags.save(tag);
         tags.push(tag);
         logger.info(`Tag "${tagName}" was created.`);
      } catch (e) {
         // So it exists
         try {
            logger.debug(`Tag name: ${tagName}`);
            let tagFound = await repoTags.findOneOrFail({
               where: {
                  name: tagName,
               },
            });
            logger.debug(`Tag found: ${JSON.stringify(tagFound)}`);
            tags.push(tagFound);
         } catch (err) {
            logger.error(JSON.stringify(err));
            // So something is wrong...
            return responseData(res, 500, 'Cannot operate with tags.', {
               tagName: tag.name,
               err: err,
            });
         }
         logger.info(`Cannot create a tag "${tagName}".`);
      }
   }

   // Add created tags to project
   project.tags = tags;

   // Set iterations
   // For all defined iterations
   let iterations: IterationsModel[] = [];
   let tasks: TasksModel[] = [];
   for (let iterationPrototype of req.body.iterations) {
      let iteration: IterationsModel = new IterationsModel();
      iteration.title = iterationPrototype.title;
      iteration.deadline = new Date(iterationPrototype.deadline);
      iteration.project = project;
      iterations.push(iteration);

      // For all iteration tasks
      for (let taskPrototype of iterationPrototype.tasks) {
         let task: TasksModel = new TasksModel();
         task.title = taskPrototype.title;
         task.description = taskPrototype.description;
         task.pointsMin = taskPrototype.pointsMin;
         task.pointsMax = taskPrototype.pointsMax;
         task.iteration = iteration;
         tasks.push(task);
      }
   }

   try {
      // One transaction
      await getConnection().transaction(async transactionalEntityManager => {
         await transactionalEntityManager.save(project);
         await transactionalEntityManager.save(roleLeaders);
         await transactionalEntityManager.save(roleVisitors);
         await transactionalEntityManager.save(iterations);
         await transactionalEntityManager.save(tasks);
      });
      return responseData(res, 200, 'Project was created.', {});
   } catch (e) {
      logger.error(e);
      return responseData(res, 409, 'Cannot create a project.', {});
   }
};
