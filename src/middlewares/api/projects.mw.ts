/**
 * @file Projects
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { getConnection } from '@utils/typeorm.util';
import { responseData, responseSimple } from '@utils/response.util';
import { validateRequestJoi } from '@utils/validator.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';
import { ProjectCategoriesModel } from '@modelsSQL/ProjectCategories.model';
import logger from '@utils/logger.util';
import { UsersModel } from '@modelsSQL/Users.model';
import { dbCreateNotifications } from '@utils/notifications.util';
import { IterationsModel } from '@modelsSQL/Iterations.model';
import { TasksModel } from '@modelsSQL/Tasks.model';
import { ProjectRolesModel } from '@modelsSQL/ProjectRoles.model';
import { TagsModel } from '@modelsSQL/Tags.model';

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
      body: joi.object().keys({
         name: joi.string().required(),

         descriptionPublic: joi.string().allow(''),
         descriptionPrivate: joi.string().allow(''),

         isSearchable: joi.boolean().required(),
         isPublic: joi.boolean().required(),
         hasOpenVacancies: joi.boolean().required(),

         categoryId: joi.number().required(),
         roles: joi
            .array()
            .required()
            .items(
               joi.object().keys({
                  name: joi.string().required(),
                  capacity: joi.number().required(),
               }),
            ),

         tags: joi
            .array()
            .required()
            .items(joi.string()),

         iterations: joi
            .array()
            .required()
            .items(
               joi.object().keys({
                  title: joi.string().required(),
                  deadline: joi.string().required(),

                  tasks: joi
                     .array()
                     .required()
                     .items(
                        joi.object().keys({
                           title: joi.string().required(),
                           description: joi.string().required(),
                           pointsMin: joi.number().required(),
                           pointsMax: joi.number().required(),
                        }),
                     ),
               }),
            ),
      }),

      params: null,
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();

   // Find user
   // ----------------------------------------------------------------------------------------------
   const repoUsers = connection.getRepository(UsersModel);
   let user;
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
   // ----------------------------------------------------------------------------------------------
   const repoProjectCategories = connection.getRepository(ProjectCategoriesModel);
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
   // ----------------------------------------------------------------------------------------------
   const project = new ProjectsModel();
   project.name = req.body.name;
   project.descriptionPublic = req.body.descriptionPublic;
   project.descriptionPrivate = req.body.descriptionPrivate;
   project.isArchived = false;
   project.isDeleted = false;
   project.hasOpenVacancies = req.body.hasOpenVacancies;
   project.isSearchable = req.body.isSearchable;
   project.isPublic = req.body.isPublic;
   project.category = category;

   // Create project roles
   // ----------------------------------------------------------------------------------------------
   const roleLeaders = new ProjectRolesModel();
   roleLeaders.name = 'Leader';
   roleLeaders.isEditable = false;
   roleLeaders.project = project;
   roleLeaders.users = [user];

   const roleVisitors = new ProjectRolesModel();
   roleVisitors.name = 'Visitors';
   roleVisitors.isEditable = false;
   roleVisitors.project = project;

   // Create tags
   // ----------------------------------------------------------------------------------------------
   const repoTags = connection.getRepository(TagsModel);

   const tags: TagsModel[] = [];
   // For tags in body
   for (let tagName of req.body.tags) {
      // Try to create
      let tag = new TagsModel();
      tag.name = tagName;
      tag.projects = [];
      try {
         await repoTags.save(tag);
         tags.push(tag);
         logger.info(`Tag "${tagName}" was created.`);
      } catch (e) {
         // Creating failed - tag exists
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
            // Unexpected error
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

   // Create iterations for project
   // ----------------------------------------------------------------------------------------------
   // For all defined iterations
   let iterations = [];
   let tasks = [];
   for (let iterationPrototype of req.body.iterations) {
      let iteration: IterationsModel = new IterationsModel();
      iteration.title = iterationPrototype.title;
      iteration.deadline = new Date(iterationPrototype.deadline);
      iteration.project = project;
      // Entities to save
      iterations.push(iteration);

      // For all iteration tasks
      for (let taskPrototype of iterationPrototype.tasks) {
         let task: TasksModel = new TasksModel();
         task.title = taskPrototype.title;
         task.description = taskPrototype.description;
         task.pointsMin = taskPrototype.pointsMin;
         task.pointsMax = taskPrototype.pointsMax;
         task.iteration = iteration;
         // Entities to save
         tasks.push(task);
      }
   }

   try {
      await getConnection().transaction(async transactionalEntityManager => {
         // Project
         await transactionalEntityManager.save(project);
         // Roles
         await transactionalEntityManager.save(roleLeaders);
         await transactionalEntityManager.save(roleVisitors);
         // Iterations
         await transactionalEntityManager.save(iterations);
         // Tasks
         await transactionalEntityManager.save(tasks);
      });

      await dbCreateNotifications(`Your project "${project.name}" was created!`, [user]);

      return responseData(res, 200, 'Project was created.', {
         projectID: project.id,
      });
   } catch (e) {
      logger.error(e);

      return responseData(res, 409, 'Cannot create a project.', {});
   }
};
