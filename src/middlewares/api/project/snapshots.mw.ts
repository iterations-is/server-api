/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { validateRequestJoi } from '@utils/validator.util';
import { responseData, responseSimple } from '@utils/response.util';
import { getConnection } from '@utils/typeorm.util';
import { SnapshotsModel } from '@modelsSQL/Snapshots.model';
import { IterationsModel } from '@modelsSQL/Iterations.model';
import { UsersModel } from '@modelsSQL/Users.model';
import { SnapshotStatesModel } from '@modelsSQL/SnapshotStates.model';
import { PartsModel } from '@modelsSQL/Parts.model';
import { ProjectsModel } from '@modelsSQL/Projects.model';
import DocumentsModel from '@modelsNoSQL/Documents.schema';
import { TasksModel } from '@modelsSQL/Tasks.model';
import { GradesModel } from '@modelsSQL/Grades.model';

const joi = require('joi');

export const mwGetAllSnapshots = async (req, res, next) => {
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
   const repoSnapshots = connection.getRepository(SnapshotsModel);

   try {
      await repoIterations.findOneOrFail({
         where: {
            id: req.params.id_iteration,
            projectsId: req.params.id_project,
         },
      });
   } catch (e) {
      return responseData(res, 404, 'Cannot find iteration');
   }

   try {
      let snapshots = await repoSnapshots.find({
         where: {
            iterationsId: req.params.id_iteration,
         },
         relations: ['state', 'createdBy', 'sentBy', 'gradedBy'],
      });

      return responseData(res, 200, 'Snapshots', { snapshots });
   } catch (e) {
      return responseData(res, 404, 'Cannot find snapshots');
   }
};

export const mwCreateSnapshot = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         parts: joi.array(),
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

   // Iteration
   // ----------------------------------------------------------------------------------------------
   let iteration: IterationsModel;
   try {
      iteration = await repoIterations.findOneOrFail({
         where: {
            id: req.params.id_iteration,
            projectsId: req.params.id_project,
         },
         relations: ['tasks'],
      });
   } catch (e) {
      return responseData(res, 404, 'Cannot find iteration');
   }

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

   // Find snapshot state
   // ----------------------------------------------------------------------------------------------
   const repoSnapshotState = connection.getRepository(SnapshotStatesModel);
   let snapshotState;
   try {
      snapshotState = await repoSnapshotState.findOneOrFail({
         where: {
            name: 'Created',
         },
      });
   } catch (e) {
      return responseSimple(res, 409, 'Cannot find a user.');
   }

   // Create copy of parts
   // ----------------------------------------------------------------------------------------------
   // ----------------------------------------------------------------------------------------------
   const repoParts = connection.getRepository(PartsModel);
   const repoProjects = connection.getRepository(ProjectsModel);

   let project: ProjectsModel;
   try {
      project = await repoProjects.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 409, 'Cannot get project.', {});
   }

   const repoTasks = connection.getRepository(TasksModel);
   const repoGrades = connection.getRepository(GradesModel);

   let partsIds = [];
   for (let partContainer of req.body.parts) {
      // Create doc
      let doc = new DocumentsModel({
         interpreter: partContainer.document.interpreter,
         store: partContainer.document.store,
      });
      try {
         await doc.save();
      } catch (e) {
         return responseData(res, 409, 'Cannot create part', { error: 'nosql' });
      }

      // Find tasks
      let tasks: TasksModel[] = [];
      for (let taskId of partContainer.tasks) {
         try {
            let task = await repoTasks.findOneOrFail(taskId);
            tasks.push(task);
         } catch (e) {
            return responseData(res, 409, 'Cannot find task');
         }
      }

      // Create part
      try {
         let part = new PartsModel();
         part.nosqlId = doc.id;
         part.project = project;
         part.isSnapshotPart = true;
         part.tasks = tasks;

         let savedPart = await repoParts.save(part);
         partsIds.push(savedPart.id);
      } catch (e) {
         return responseData(res, 409, 'Cannot create part');
      }
   }

   // ----------------------------------------------------------------------------------------------
   // ----------------------------------------------------------------------------------------------

   // Create snapshot
   // ----------------------------------------------------------------------------------------------
   let snapshot = new SnapshotsModel();
   snapshot.iteration = iteration;
   snapshot.state = snapshotState;
   snapshot.partsListJson = JSON.stringify(partsIds);

   snapshot.createdBy = user;
   snapshot.gradedBy = null;
   snapshot.sentBy = null;

   // Transaction
   try {
      await getConnection().transaction(async transactionalEntityManager => {
         // Snapshot
         await transactionalEntityManager.save(snapshot);
      });

      let grades: GradesModel[] = [];
      for (let uniqueTask of iteration.tasks) {
         let grade = new GradesModel();
         grade.message = null;
         grade.points = null;
         grade.snapshot = snapshot;
         grade.task = uniqueTask;
         grades.push(grade);
      }

      await repoGrades.save(grades);

      return responseData(res, 200, 'Snapshot was created.', {});
   } catch (e) {
      return responseData(res, 409, 'Cannot create a snapshot.', { e });
   }
};

export const mwGetSnapshot = async (req, res, next) => {
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
         id_snapshot: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoIterations = connection.getRepository(IterationsModel);
   const repoSnapshots = connection.getRepository(SnapshotsModel);

   try {
      await repoIterations.findOneOrFail({
         where: {
            id: req.params.id_iteration,
            projectsId: req.params.id_project,
         },
      });
   } catch (e) {
      return responseData(res, 404, 'Cannot find iteration');
   }

   try {
      let snapshot = await repoSnapshots.findOneOrFail({
         where: {
            id: req.params.id_snapshot,
            iterationsId: req.params.id_iteration,
         },
         relations: ['state', 'createdBy', 'sentBy', 'gradedBy', 'iteration'],
      });

      return responseData(res, 200, 'Snapshot', { snapshot });
   } catch (e) {
      return responseData(res, 404, 'Cannot find snapshot');
   }
};

export const mwSendSnapshotForGrading = async (req, res, next) => {
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
         id_snapshot: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoIterations = connection.getRepository(IterationsModel);
   const repoSnapshots = connection.getRepository(SnapshotsModel);

   try {
      await repoIterations.findOneOrFail({
         where: {
            id: req.params.id_iteration,
            projectsId: req.params.id_project,
         },
      });
   } catch (e) {
      return responseData(res, 404, 'Cannot find iteration');
   }

   let snapshot: SnapshotsModel;
   try {
      snapshot = await repoSnapshots.findOneOrFail({
         where: {
            id: req.params.id_snapshot,
            iterationsId: req.params.id_iteration,
         },
         relations: ['state'],
      });
   } catch (e) {
      return responseData(res, 404, 'Cannot find snapshot');
   }

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

   // Find snapshot state
   // ----------------------------------------------------------------------------------------------
   const repoSnapshotState = connection.getRepository(SnapshotStatesModel);
   let snapshotState: SnapshotStatesModel;
   try {
      snapshotState = await repoSnapshotState.findOneOrFail({
         where: {
            name: 'Sent',
         },
      });
   } catch (e) {
      return responseSimple(res, 409, 'Cannot find a user.');
   }

   snapshot.state = snapshotState;
   snapshot.sentBy = user;
   snapshot.dateSent = new Date();

   try {
      await repoSnapshots.save(snapshot);
      return responseSimple(res, 200, 'Snapshot was sent for grading..');
   } catch (e) {
      return responseSimple(res, 409, 'Cannot send snapshot for grading.');
   }
};

export const mwGetSnapshotGrades = async (req, res, next) => {
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
         id_snapshot: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoGrades = connection.getRepository(GradesModel);

   try {
      let grades = await repoGrades.find({
         where: {
            snapshotId: req.params.id_snapshot,
         },
         relations: ['task'],
      });

      return responseData(res, 200, 'Snapshot grades.', { grades });
   } catch (e) {
      return responseData(res, 409, 'Cannot take snapshot grades.');
   }
};

export const mwGradeSnapshot = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         grades: joi.array().items(
            joi.object().keys({
               id: joi
                  .number()
                  .min(0)
                  .required(),
               message: joi
                  .string()
                  .min(0)
                  .required(),
               points: joi
                  .number()
                  .min(0)
                  .required(),
            }),
         ),
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
         id_snapshot: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoGrades = connection.getRepository(GradesModel);
   const repoSnapshot = connection.getRepository(SnapshotsModel);

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

   try {
      for (const gradeItem of req.body.grades) {
         let grade = await repoGrades.findOneOrFail(gradeItem.id);
         grade.points = gradeItem.points;
         grade.message = gradeItem.message;

         await repoGrades.save(grade);
      }

      let snapshot = await repoSnapshot.findOneOrFail(req.params.id_snapshot);
      snapshot.gradedBy = user;
      snapshot.dateGraded = new Date();

      await repoSnapshot.save(snapshot);

      return responseData(res, 200, 'Graded.');
   } catch (e) {
      return responseData(res, 409, 'Cannot grade.');
   }
};
