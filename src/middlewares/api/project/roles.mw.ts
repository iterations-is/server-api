/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { validateRequestJoi } from '@utils/validator.util';
import { responseData, responseSimple } from '@utils/response.util';
import { getConnection } from '@utils/typeorm.util';
import { ProjectRolesModel } from '@modelsSQL/ProjectRoles.model';
import { ProjectsModel } from '@modelsSQL/Projects.model';

const joi = require('joi');

export const mwGetProjectRoles = async (req, res, next) => {
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

   const repoProject = connection.getRepository(ProjectsModel);

   try {
      await repoProject.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 400, 'Cannot find project', {});
   }

   const repoProjectsRoles = connection.getRepository(ProjectRolesModel);

   let projectRoles: ProjectRolesModel[];
   try {
      projectRoles = await repoProjectsRoles.find({
         select: ['name', 'isEditable', 'id', 'capacity'],
         where: {
            projectId: req.params.id_project,
         },
      });

      return responseData(res, 200, 'Project roles', {
         roles: projectRoles,
      });
   } catch (e) {
      return responseData(res, 409, 'Cannot get project.', {});
   }
};

export const mwCreateProjectRole = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         name: joi
            .string()
            .min(0)
            .required(),
         capacity: joi
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

   if (req.project.permissions !== 'leader') return responseSimple(res, 403, 'Forbidden');

   const connection = getConnection();
   const repoProject = connection.getRepository(ProjectsModel);

   let project;
   try {
      project = await repoProject.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 400, 'Cannot find project', {});
   }

   const repoProjectsRoles = connection.getRepository(ProjectRolesModel);

   let newRole = new ProjectRolesModel();
   newRole.project = project;
   newRole.name = req.body.name;
   newRole.isEditable = true;
   newRole.capacity = req.body.capacity;

   try {
      await repoProjectsRoles.save(newRole);

      return responseData(res, 200, 'Project role was created', {
         role: newRole,
      });
   } catch (e) {
      return responseData(res, 409, 'Cannot create project role', {});
   }
};
