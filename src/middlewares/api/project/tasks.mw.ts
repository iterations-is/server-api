/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */
import { IterationsModel } from '@modelsSQL/Iterations.model';
import { validateRequestJoi } from '@utils/validator.util';
import { responseData, responseSimple } from '@utils/response.util';
import { getConnection } from '@utils/typeorm.util';
import { TasksModel } from '@modelsSQL/Tasks.model';

const joi = require('joi');

export const mwGetProjectTasks = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: null,
      params: joi.object().keys({
         id_project: joi
            .number()
            .min(0)
            .required(),
         id_iteration: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   if (req.project.permissions === 'nobody') return responseSimple(res, 403, 'Forbidden');

   const connection = getConnection();
   const repoTasks = connection.getRepository(TasksModel);

   const repoIterations = connection.getRepository(IterationsModel);
   let iteration;
   try {
      iteration = await repoIterations.findOneOrFail({
         where: {
            id: req.params.id_iteration,
            projectsId: req.params.id_project,
         },
      });
   } catch (e) {
      return responseData(res, 404, 'Cannot get project iteration.');
   }

   try {
      let tasks = await repoTasks.find({
         where: {
            iterationsId: req.params.id_iteration,
         },
      });
      return responseData(res, 200, 'Project tasks in iterations.', {
         iteration: req.params.id_iteration,
         tasks,
      });
   } catch (e) {
      return responseData(res, 200, 'Cannot get tasks.');
   }
};

export const mwCreateProjectTask = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         title: joi.string().required(),
         description: joi
            .string()
            .allow('')
            .required(),
         pointsMin: joi
            .number()
            .min(0)
            .required(),
         pointsMax: joi
            .number()
            .min(0)
            .required(),
      }),
      params: joi.object().keys({
         id_project: joi
            .number()
            .min(0)
            .required(),
         id_iteration: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   if (req.project.permissions !== 'leader') return responseSimple(res, 403, 'Forbidden');

   const connection = getConnection();
   const repoIterations = connection.getRepository(IterationsModel);
   const repoTasks = connection.getRepository(TasksModel);

   let iteration;
   try {
      iteration = await repoIterations.findOneOrFail({
         where: {
            id: req.params.id_iteration,
            projectsId: req.params.id_project,
         },
      });
   } catch (e) {
      return responseData(res, 404, 'Cannot get project iteration.');
   }

   let task = new TasksModel();
   task.title = req.body.title;
   task.description = req.body.description;
   task.pointsMin = req.body.pointsMin;
   task.pointsMax = req.body.pointsMax;
   task.iteration = iteration;

   try {
      await repoTasks.save(task);
      return responseData(res, 200, 'Task was created.', { task });
   } catch (e) {
      return responseData(res, 200, 'Cannot create task.', {});
   }
};

export const mwGetProjectTask = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: null,
      params: joi.object().keys({
         id_project: joi
            .number()
            .min(0)
            .required(),
         id_iteration: joi
            .number()
            .min(0)
            .required(),
         id_task: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   if (req.project.permissions === 'nobody') return responseSimple(res, 403, 'Forbidden');

   const connection = getConnection();
   const repoIterations = connection.getRepository(IterationsModel);
   try {
      await repoIterations.findOneOrFail({
         where: {
            id: req.params.id_iteration,
            projectsId: req.params.id_project,
         },
      });
   } catch (e) {
      return responseData(res, 404, 'Cannot get project iteration.');
   }

   const repoTasks = connection.getRepository(TasksModel);

   try {
      let task = await repoTasks.findOneOrFail(req.params.id_task);
      return responseData(res, 200, 'Project task in iteration.', { task });
   } catch (e) {
      return responseData(res, 200, 'Cannot get task.');
   }
};

export const mwUpdateProjectTask = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         title: joi.string().required(),
         description: joi
            .string()
            .allow('')
            .required(),
         pointsMin: joi
            .number()
            .min(0)
            .required(),
         pointsMax: joi
            .number()
            .min(0)
            .required(),
      }),
      params: joi.object().keys({
         id_project: joi
            .number()
            .min(0)
            .required(),
         id_iteration: joi
            .number()
            .min(0)
            .required(),
         id_task: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   if (req.project.permissions !== 'leader') return responseSimple(res, 403, 'Forbidden');

   const connection = getConnection();
   const repoIterations = connection.getRepository(IterationsModel);

   try {
      await repoIterations.findOneOrFail({
         where: {
            id: req.params.id_iteration,
            projectsId: req.params.id_project,
         },
      });
   } catch (e) {
      return responseData(res, 404, 'Cannot get project iteration.');
   }

   const repoTasks = connection.getRepository(TasksModel);

   try {
      let task = await repoTasks.findOneOrFail(req.params.id_task);
      task.title = req.body.title;
      task.description = req.body.description;
      task.pointsMin = req.body.pointsMin;
      task.pointsMax = req.body.pointsMax;

      await repoTasks.save(task);

      return responseData(res, 200, 'Task was updated.', { task });
   } catch (e) {
      return responseData(res, 400, 'Cannot change task.');
   }
};

export const mwRemoveProjectTask = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: null,
      params: joi.object().keys({
         id_project: joi
            .number()
            .min(0)
            .required(),
         id_iteration: joi
            .number()
            .min(0)
            .required(),
         id_task: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   if (req.project.permissions !== 'leader') return responseSimple(res, 403, 'Forbidden');

   const connection = getConnection();
   const repoIterations = connection.getRepository(IterationsModel);

   try {
      await repoIterations.findOneOrFail({
         where: {
            id: req.params.id_iteration,
            projectsId: req.params.id_project,
         },
      });
   } catch (e) {
      return responseData(res, 404, 'Cannot find project iteration.');
   }

   const repoTasks = connection.getRepository(TasksModel);
   let task;
   try {
      task = await repoTasks.findOneOrFail(req.params.id_task);
   } catch (e) {
      return responseData(res, 400, 'Cannot find task.');
   }

   try {
      await repoTasks.remove(task);
      return responseData(res, 200, 'Task removed');
   } catch (e) {
      return responseData(res, 400, 'Cannot remove task, it has some dependencies (tasks).');
   }
};
