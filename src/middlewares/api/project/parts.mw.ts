/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { validateRequestJoi } from '@utils/validator.util';
import { responseData } from '@utils/response.util';
import { getConnection } from '@utils/typeorm.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';

import DocumentsModel from '@modelsNoSQL/Documents.schema';
import { PartsModel } from '@modelsSQL/Parts.model';
import { TasksModel } from '@modelsSQL/Tasks.model';
import { UserProjectRole } from '@middlewares/permissions.mw';

const joi = require('joi');

export const mwGetParts = async (req, res, next) => {
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

   // TODO Permissions

   const connection = getConnection();
   const repoParts = connection.getRepository(PartsModel);
   const repoProject = connection.getRepository(ProjectsModel);

   let parts;
   try {
      parts = await repoParts.find({
         where: {
            projectsId: req.params.id_project,
            isSnapshotPart: false,
         },
         relations: ['tasks'],
      });
   } catch (e) {
      return responseData(res, 404, 'Parts dont exist');
   }

   for (let part of parts) {
      try {
         let document = await DocumentsModel.findById(part.nosqlId).exec();

         if (document === null)
            return responseData(res, 400, 'Cannot find document', { id: part.nosqlId });

         part['document'] = {
            interpreter: document.interpreter,
            store: document.store,
         };
      } catch (e) {
         return responseData(res, 400, 'Unexpected error', {});
      }
   }

   // Private content
   let isPublicContent = true;
   try {
      let project = await repoProject.findOneOrFail({
         where: {
            id: req.params.id_project,
         },
         select: ['isPublic'],
      });

      isPublicContent = project.isPublic;
   } catch (e) {
      return responseData(res, 400, 'Unexpected error', {});
   }

   if (
      req.payload.userProjectRole === UserProjectRole.NOBODY && // user is nobody
      !isPublicContent
   )
      parts = [];

   return responseData(res, 200, 'Project parts', { parts });
};

export const mwCreatePart = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         interpreter: joi.string().required(),
         store: joi.object(),
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

   // TODO Permissions

   const connection = getConnection();
   const repoParts = connection.getRepository(PartsModel);
   const repoProjects = connection.getRepository(ProjectsModel);

   let project: ProjectsModel;
   try {
      project = await repoProjects.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 409, 'Cannot get project.', {});
   }

   let doc = new DocumentsModel({
      interpreter: req.body.interpreter,
      store: req.body.store,
   });

   try {
      await doc.save();
   } catch (e) {
      return responseData(res, 200, 'Cannot create part', { error: 'nosql' });
   }

   try {
      let part = new PartsModel();
      part.nosqlId = doc.id;
      part.project = project;

      await repoParts.save(part);

      return responseData(res, 200, 'Part in mongo', {
         part,
         document: {
            interpreter: doc.interpreter,
            store: doc.store,
         },
      });
   } catch (e) {
      return responseData(res, 200, 'Cannot create part');
   }
};

export const mwGetPart = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: null,
      params: joi.object().keys({
         id_project: joi
            .number()
            .min(0)
            .required(),
         id_part: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   // TODO Permissions

   const connection = getConnection();
   const repoParts = connection.getRepository(PartsModel);

   let part;
   try {
      part = await repoParts.findOneOrFail({
         where: {
            id: req.params.id_part,
            projectsId: req.params.id_project,
         },
         relations: ['tasks'],
      });
   } catch (e) {
      return responseData(res, 404, 'Part doesnt exist');
   }

   try {
      let document = await DocumentsModel.findById(part.nosqlId).exec();

      if (document === null)
         return responseData(res, 200, 'Cannot find document', { id: part.nosqlId });

      part['document'] = {
         interpreter: document.interpreter,
         store: document.store,
      };
   } catch (e) {
      return responseData(res, 200, 'Unexpected error', {});
   }

   return responseData(res, 200, 'Part', { part });
};

export const mwUpdatePart = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         interpreter: joi.string().required(),
         store: joi.object(),
      }),
      params: joi.object().keys({
         id_project: joi
            .number()
            .min(0)
            .required(),
         id_part: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   // TODO Permissions

   const connection = getConnection();
   const repoParts = connection.getRepository(PartsModel);

   let part;
   try {
      part = await repoParts.findOneOrFail({
         where: {
            id: req.params.id_part,
            projectsId: req.params.id_project,
            isSnapshotPart: false,
         },
      });
   } catch (e) {
      return responseData(res, 404, 'Part doesnt exist');
   }

   try {
      let document = await DocumentsModel.findById(part.nosqlId).exec();

      if (document === null)
         return responseData(res, 200, 'Cannot find document', { id: part.nosqlId });

      document.interpreter = req.body.interpreter;
      document.store = req.body.store;

      await document.save();

      return responseData(res, 200, 'Part was saved', { document });
   } catch (e) {
      return responseData(res, 200, 'Cannot save part', {});
   }
};

export const mwRemovePart = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: null,
      params: joi.object().keys({
         id_project: joi
            .number()
            .min(0)
            .required(),
         id_part: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   // TODO Permissions

   const connection = getConnection();
   const repoParts = connection.getRepository(PartsModel);

   let part: PartsModel;
   try {
      part = await repoParts.findOneOrFail({
         where: {
            id: req.params.id_part,
            projectsId: req.params.id_project,
            isSnapshotPart: false,
         },
      });
   } catch (e) {
      return responseData(res, 404, 'Part doesnt exist');
   }

   // Remove part_completes_tasks
   try {
      part.tasks = [];
      await repoParts.save(part);
   } catch (e) {
      return responseData(res, 500, 'Cannot remove completions');
   }

   try {
      await DocumentsModel.findOne({ _id: part.nosqlId })
         .remove()
         .exec();

      await repoParts.remove(part);

      return responseData(res, 200, 'Part was deleted');
   } catch (e) {
      return responseData(res, 200, 'Cannot delete part');
   }
};

export const mwPartCompleteTasks = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         tasks: joi
            .array()
            .required()
            .items(joi.number()),
      }),
      params: joi.object().keys({
         id_project: joi
            .number()
            .min(0)
            .required(),
         id_part: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   // TODO Permissions

   const connection = getConnection();
   const repoParts = connection.getRepository(PartsModel);
   const repoTasks = connection.getRepository(TasksModel);

   let part: PartsModel;
   try {
      part = await repoParts.findOneOrFail({
         where: {
            id: req.params.id_part,
            projectsId: req.params.id_project,
            isSnapshotPart: false,
         },
      });
   } catch (e) {
      return responseData(res, 404, 'Part doesnt exist');
   }

   let tasks = [];
   try {
      for (let id of req.body.tasks) {
         let task = await repoTasks.findOneOrFail(id);
         tasks.push(task);
      }
   } catch (e) {
      return responseData(res, 404, 'Cannot find task');
   }

   part.tasks = tasks;

   try {
      await repoParts.save(part);
      return responseData(res, 404, 'Part saved');
   } catch (e) {
      return responseData(res, 404, 'Cannot assign tasks to the part');
   }
};
