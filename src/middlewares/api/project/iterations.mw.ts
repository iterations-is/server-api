/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */
import { IterationsModel } from '@modelsSQL/Iterations.model';
import { validateRequestJoi } from '@utils/validator.util';
import { responseData, responseSimple } from '@utils/response.util';
import { getConnection } from '@utils/typeorm.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';

const joi = require('joi');

export const mwGetProjectIterations = async (req, res, next) => {
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
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoIterations = connection.getRepository(IterationsModel);
   try {
      let iterations = await repoIterations.find({
         where: {
            projectsId: req.params.id_project,
         },
         relations: ['tasks'],
         order: {
            id: 'ASC',
         },
      });
      return responseData(res, 200, 'Project iterations.', { iterations });
   } catch (e) {
      return responseData(res, 200, 'Cannot get project iterations.');
   }
};

export const mwCreateProjectIterations = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         title: joi.string().required(),
         deadline: joi
            .number()
            .min(0)
            .required(),
      }),
      params: joi.object().keys({
         id_project: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoProject = connection.getRepository(ProjectsModel);

   let project;
   try {
      project = await repoProject.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 400, 'Cannot find project', {});
   }

   let iteration = new IterationsModel();
   iteration.title = req.body.title;
   iteration.deadline = new Date(req.body.deadline);
   iteration.project = project;

   const repoIterations = connection.getRepository(IterationsModel);
   try {
      await repoIterations.save(iteration);
      return responseData(res, 200, 'Iteration was created.', { iteration });
   } catch (e) {
      return responseData(res, 200, 'Cannot create iteration.', {});
   }
};

export const mwGetProjectIteration = async (req, res, next) => {
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

   const connection = getConnection();
   const repoIterations = connection.getRepository(IterationsModel);
   try {
      let iteration = await repoIterations.findOneOrFail({
         where: {
            id: req.params.id_iteration,
            projectsId: req.params.id_project,
         },
         relations: ['tasks'],
      });
      return responseData(res, 200, 'Project iteration.', { iteration });
   } catch (e) {
      return responseData(res, 404, 'Cannot get project iteration.');
   }
};

export const mwUpdateProjectIteration = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         title: joi.string().required(),
         deadline: joi
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

   const connection = getConnection();
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
      iteration.title = req.body.title;
      iteration.deadline = new Date(req.body.deadline);
      await repoIterations.save(iteration);

      return responseData(res, 200, 'Project iteration was changed.', { iteration });
   } catch (e) {
      return responseData(res, 400, 'Cannot change project iteration.');
   }
};

export const mwRemoveProjectIteration = async (req, res, next) => {
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

   const connection = getConnection();
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
      return responseData(res, 404, 'Cannot find project iteration.');
   }

   try {
      await repoIterations.remove(iteration);

      return responseData(res, 200, 'Project iteration was deleted.', { iteration });
   } catch (e) {
      return responseData(
         res,
         400,
         'Cannot change project iteration, it has some dependencies (tasks).',
      );
   }
};
