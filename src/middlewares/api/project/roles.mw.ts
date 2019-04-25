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

export const mwPatchProjectFreeContributors = async (req, res, next) => {
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
   const repoProjects = connection.getRepository(ProjectsModel);

   let project: ProjectsModel;
   try {
      project = await repoProjects.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 409, 'Cannot get project.', {});
   }

   try {
      project.hasOpenVacancies = !project.hasOpenVacancies;
      await repoProjects.save(project);
      return responseData(res, 200, 'Project open vacancies status updated', {
         isPublic: project.hasOpenVacancies,
      });
   } catch (e) {
      return responseSimple(res, 500, 'Cannot change vacancies');
   }
};

export const mwUpdateProjectRole = async (req, res, next) => {
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
         id_role: joi
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

   try {
      let role = await repoProjectsRoles.findOneOrFail(req.params.id_role);

      role.capacity = req.body.capacity;
      role.name = req.body.name;

      await repoProjectsRoles.save(role);

      return responseData(res, 200, 'Project role was saved', {});
   } catch (e) {
      return responseData(res, 409, 'Cannot save project role', {});
   }
};

export const mwDeleteProjectRole = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: null,
      params: joi.object().keys({
         id_project: joi
            .number()
            .min(0)
            .required(),
         id_role: joi
            .number()
            .min(0)
            .required(),
      }),
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoProjectRoles = connection.getRepository(ProjectRolesModel);

   let role;
   try {
      role = await repoProjectRoles.findOneOrFail(req.params.id_role);
   } catch (e) {
      return responseSimple(res, 404, 'Cannot find role');
   }

   try {
      // Check if role has users

      let roleUsers = await repoProjectRoles
         .createQueryBuilder('roles')
         .where('roles.id = :id', { id: req.params.id_role })
         .leftJoinAndSelect('roles.users', 'users')
         .getMany();

      if (roleUsers[0].users.length > 0) {
         return responseSimple(res, 400, 'Project roles has users, cannot delete');
      }

      await repoProjectRoles.remove(role);
      return responseData(res, 200, 'Project role was removed', {});
   } catch (e) {
      return responseData(res, 500, 'Cannot remove role', {});
   }
};
