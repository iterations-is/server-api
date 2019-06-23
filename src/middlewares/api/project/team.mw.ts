/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { ProjectRolesModel } from '@modelsSQL/ProjectRoles.model';
import { validateRequestJoi } from '@utils/validator.util';
import { responseData, responseSimple } from '@utils/response.util';
import { getConnection } from '@utils/typeorm.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';
import { UsersModel } from '@modelsSQL/Users.model';

const joi = require('joi');

export const mwGetProjectTeam = async (req, res, next) => {
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
   const repoProjectCategories = connection.getRepository(ProjectsModel);

   let project;
   try {
      project = await repoProjectCategories.findOneOrFail(req.params.id_project, {
         relations: ['roles'],
      });

      // Get contributors
      let team = [];
      for (let role of project.roles) {
         let repoProjectRoles = await connection.getRepository(ProjectRolesModel);
         let roleUsers = await repoProjectRoles
            .createQueryBuilder('projectRoles')
            .where('projectRoles.id = :prRo', { prRo: role.id })
            .leftJoinAndSelect('projectRoles.users', 'users')
            .getMany();

         team.push(roleUsers);
      }

      return responseData(res, 200, 'Project team.', { team });
   } catch (e) {
      return responseData(res, 409, 'Cannot get metadata.', { e });
   }
};

export const mwJoinProjectTeam = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         projectRoleId: joi
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
   const repoProjects = connection.getRepository(ProjectsModel);
   const repoProjectRoles = connection.getRepository(ProjectRolesModel);

   // Check project
   // ----------------------------------------------------------------------------------------------
   let project: ProjectsModel;
   try {
      project = await repoProjects.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 404, 'Cannot find project.');
   }

   if (project.isArchived) return responseData(res, 409, 'Project is archived.');
   if (!project.hasOpenVacancies) return responseData(res, 409, 'Project vacancies closed.');

   // Check vacancy
   // ----------------------------------------------------------------------------------------------
   let projectRole: ProjectRolesModel;
   try {
      projectRole = await repoProjectRoles.findOneOrFail({
         where: {
            id: req.body.projectRoleId,
            project: project,
         },
         relations: ['users'],
      });
   } catch (e) {
      return responseData(res, 200, 'Project role does not exist');
   }

   if (projectRole.name !== 'Leader' && projectRole.name !== 'Visitors')
      if (projectRole.users.length >= projectRole.capacity)
         return responseData(res, 400, 'No free vacancies.');

   // Ger project roles ID
   // ----------------------------------------------------------------------------------------------
   let projectRoles;
   try {
      projectRoles = await repoProjectRoles.find({
         where: {
            project: project,
         },
         select: ['id'],
      });
   } catch (e) {}

   let projectRolesIds = [];
   projectRoles.forEach(role => {
      projectRolesIds.push(role.id);
   });

   // Get project leaders
   // ----------------------------------------------------------------------------------------------
   let projectRoleLeaders;
   try {
      projectRoleLeaders = await repoProjectRoles.findOneOrFail({
         where: {
            project: project,
            name: 'Leader',
         },
         relations: ['users'],
      });
   } catch (e) {}

   // Find user
   // ----------------------------------------------------------------------------------------------
   const repoUsers = connection.getRepository(UsersModel);
   let user;
   try {
      user = await repoUsers.findOneOrFail({
         where: {
            id: req.jwt.userId,
         },
         relations: ['projectRoles'],
      });
   } catch (e) {
      return responseSimple(res, 409, 'Cannot find a user.');
   }

   // Check if user has role in project and remove if, if possible
   let isEnd = false;
   (() => {
      for (let i = 0; i < user.projectRoles.length; ++i) {
         for (let roleId of projectRolesIds) {
            if (user.projectRoles[i].id === roleId) {
               // User has role in the project

               // Remove prev role
               // Check if last leader
               if (roleId === projectRoleLeaders.id) {
                  // Is a leader
                  // Last leader
                  if (projectRoleLeaders.users.length === 1) {
                     isEnd = true;
                     return;
                  }
               }

               user.projectRoles.splice(i, 1);
               return;
            }
         }
      }
   })();

   if (isEnd) return responseData(res, 400, 'You cannot change role, you are the last leader');

   // Add new role
   user.projectRoles.push(projectRole);

   // Save new role
   try {
      await repoUsers.save(user);
      return responseData(res, 200, 'You have join project');
   } catch (e) {
      return responseData(res, 500, 'Cannot join project');
   }
};

export const mwLeaveProjectTeam = async (req, res, next) => {
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
   const repoProjectRoles = connection.getRepository(ProjectRolesModel);

   // Check project
   // ----------------------------------------------------------------------------------------------
   let project: ProjectsModel;
   try {
      project = await repoProjects.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 404, 'Cannot find project.');
   }

   if (!project.hasOpenVacancies) return responseData(res, 409, 'Project vacancies closed.');

   // Ger project roles ID
   // ----------------------------------------------------------------------------------------------
   let projectRoles;
   try {
      projectRoles = await repoProjectRoles.find({
         where: {
            project: project,
         },
         select: ['id'],
      });
   } catch (e) {}

   let projectRolesIds = [];
   projectRoles.forEach(role => {
      projectRolesIds.push(role.id);
   });

   // Get project leaders
   // ----------------------------------------------------------------------------------------------
   let projectRoleLeaders;
   try {
      projectRoleLeaders = await repoProjectRoles.findOneOrFail({
         where: {
            project: project,
            name: 'Leader',
         },
         relations: ['users'],
      });
   } catch (e) {}

   // Find user
   // ----------------------------------------------------------------------------------------------
   const repoUsers = connection.getRepository(UsersModel);
   let user;
   try {
      user = await repoUsers.findOneOrFail({
         where: {
            id: req.jwt.userId,
         },
         relations: ['projectRoles'],
      });
   } catch (e) {
      return responseSimple(res, 409, 'Cannot find a user.');
   }

   // Check if user has role in project and remove if, if possible

   let isRemoved = false;
   let isEnd = false;
   (() => {
      for (let i = 0; i < user.projectRoles.length; ++i) {
         for (let roleId of projectRolesIds) {
            if (user.projectRoles[i].id === roleId) {
               // User has role in the project

               // Remove prev role
               // Check if last leader
               if (roleId === projectRoleLeaders.id) {
                  // Is a leader
                  // Last leader
                  if (projectRoleLeaders.users.length === 1) {
                     isEnd = true;
                     return;
                  }
               }

               user.projectRoles.splice(i, 1);
               isRemoved = true;
               return;
            }
         }
      }
   })();

   if (isEnd) return responseData(res, 400, 'You cannot change role, you are the last leader');
   if (!isRemoved) return responseData(res, 400, 'You are not a part of the team');

   // Save new role
   try {
      await repoUsers.save(user);
      return responseData(res, 200, 'You have left the project');
   } catch (e) {
      return responseData(res, 500, 'Cannot leave project');
   }
};

export const mwAssignUserToProjectTeam = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         projectRoleId: joi
            .number()
            .min(0)
            .required(),
         username: joi.string().required(),
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
   const repoProjects = connection.getRepository(ProjectsModel);
   const repoProjectRoles = connection.getRepository(ProjectRolesModel);

   // Current user should be trusted
   // ----------------------------------------------------------------------------------------------
   const repoUsers = connection.getRepository(UsersModel);
   try {
      let userJwt = await repoUsers.findOneOrFail({
         where: {
            id: req.jwt.userId,
         },
         relations: ['role'],
      });

      if (!userJwt.role.isAuthority)
         return responseSimple(res, 403, 'Forbidden. You are not an authority.');
   } catch (e) {
      return responseSimple(res, 409, 'Cannot find a user jwt.');
   }

   // Check project
   // ----------------------------------------------------------------------------------------------
   let project: ProjectsModel;
   try {
      project = await repoProjects.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 404, 'Cannot find project.');
   }

   if (project.isArchived) return responseData(res, 409, 'Project is archived.');

   // Get role
   // ----------------------------------------------------------------------------------------------
   let projectRole;
   try {
      projectRole = await repoProjectRoles.findOneOrFail({
         where: {
            id: req.body.projectRoleId,
            project: project,
         },
      });
   } catch (e) {
      return responseData(res, 200, 'Project role does not exist');
   }

   // Get project roles ID
   // ----------------------------------------------------------------------------------------------
   let projectRoles;
   try {
      projectRoles = await repoProjectRoles.find({
         where: {
            project: project,
         },
         select: ['id'],
      });
   } catch (e) {}

   let projectRolesIds = [];
   projectRoles.forEach(role => {
      projectRolesIds.push(role.id);
   });

   // Find user
   // ----------------------------------------------------------------------------------------------
   let user;
   try {
      user = await repoUsers.findOneOrFail({
         where: {
            authUsername: req.body.username,
         },
         relations: ['projectRoles'],
      });
   } catch (e) {
      return responseSimple(res, 409, 'Cannot find a user to assign.');
   }

   // Check if user has role in project and remove if, if possible
   (() => {
      for (let i = 0; i < user.projectRoles.length; ++i) {
         for (let roleId of projectRolesIds) {
            if (user.projectRoles[i].id === roleId) {
               // User has role in the project
               user.projectRoles.splice(i, 1);
               return;
            }
         }
      }
   })();

   // Add new role
   user.projectRoles.push(projectRole);

   // Save new role
   try {
      await repoUsers.save(user);
      return responseData(res, 200, 'You have assign user to project');
   } catch (e) {
      return responseData(res, 500, 'Cannot ad user to project');
   }
};

export const mwRemoveUserFromProjectTeam = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         username: joi.string().required(),
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
   const repoProjects = connection.getRepository(ProjectsModel);
   const repoProjectRoles = connection.getRepository(ProjectRolesModel);
   const repoUsers = connection.getRepository(UsersModel);

   // Check project
   // ----------------------------------------------------------------------------------------------
   let project: ProjectsModel;
   try {
      project = await repoProjects.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 404, 'Cannot find project.');
   }

   if (project.isArchived) return responseData(res, 409, 'Project is archived.');

   // Get project roles ID
   // ----------------------------------------------------------------------------------------------
   let projectRoles;
   try {
      projectRoles = await repoProjectRoles.find({
         where: {
            project: project,
         },
         select: ['id'],
      });
   } catch (e) {}

   let projectRolesIds = [];
   projectRoles.forEach(role => {
      projectRolesIds.push(role.id);
   });

   // Get project leaders
   // ----------------------------------------------------------------------------------------------
   let projectRoleLeaders;
   try {
      projectRoleLeaders = await repoProjectRoles.findOneOrFail({
         where: {
            project: project,
            name: 'Leader',
         },
         relations: ['users'],
      });
   } catch (e) {}

   // Find user
   // ----------------------------------------------------------------------------------------------
   let user;
   try {
      user = await repoUsers.findOneOrFail({
         where: {
            authUsername: req.body.username,
         },
         relations: ['projectRoles'],
      });
   } catch (e) {
      return responseSimple(res, 409, 'Cannot find a user to remove.');
   }

   // Check if user has role in project and remove if, if possible

   let isRemoved = false;
   let isEnd = false;
   (() => {
      for (let i = 0; i < user.projectRoles.length; ++i) {
         for (let roleId of projectRolesIds) {
            if (user.projectRoles[i].id === roleId) {
               // User has role in the project

               // Remove prev role
               // Check if last leader
               if (roleId === projectRoleLeaders.id) {
                  // Is a leader
                  // Last leader
                  if (projectRoleLeaders.users.length === 1) {
                     isEnd = true;
                     return;
                  }
               }

               user.projectRoles.splice(i, 1);
               isRemoved = true;
               return;
            }
         }
      }
   })();

   if (isEnd) return responseData(res, 400, 'You cannot change role, you are the last leader');
   if (!isRemoved) return responseData(res, 400, 'You are not a part of the team');

   // Save new role
   try {
      await repoUsers.save(user);
      return responseData(res, 200, 'You have removed user from project');
   } catch (e) {
      return responseData(res, 500, 'Cannot remove user from project');
   }
};
