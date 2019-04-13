/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { validateRequestJoi } from '@utils/validator.util';
import { responseData, responseSimple } from '@utils/response.util';
import { getConnection } from '@utils/typeorm.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';
import { meta, tags } from 'joi';
import { response } from 'express';
import { ProjectRolesModel } from '@modelsSQL/ProjectRoles.model';

const joi = require('joi');

export const mwGetProjectMetadata = async (req, res, next) => {
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

   let metadataPublic;
   try {
      metadataPublic = await repoProjectCategories.findOneOrFail(req.params.id_project, {
         // select: [
         //    'id',
         //    'name',
         //    'descriptionPublic',
         //    'isArchived',
         //    'isPublic',
         //    'hasOpenVacancies',
         //    'isSearchable',
         //    'createdAt',
         // ],
         relations: ['tags', 'category', 'roles', 'iterations'],
      });

      if (metadataPublic.isDeleted) throw 'Project is deleted.';

      // Get contributors
      metadataPublic.contributors = [];
      for (let role of metadataPublic.roles) {
         let repoProjectRoles = await connection.getRepository(ProjectRolesModel);
         // let roleUsers = await repoProjectRoles.find({
         //    where: {
         //       id: role.id,
         //    },
         //    select: ['name'],
         //    relations: ['users'],
         // });

         let roleUsers = await repoProjectRoles
            .createQueryBuilder('projectRoles')
            .where('projectRoles.id = :prRo', { prRo: role.id })
            .leftJoinAndSelect('projectRoles.users', 'users')
            .getMany();

         metadataPublic.contributors.push(roleUsers);
      }
   } catch (e) {
      return responseData(res, 409, 'Cannot get metadata.', { e });
   }

   if (req.project.permissions === 'nobody') delete metadataPublic.descriptionPrivate;

   return responseData(res, 200, 'Project metadata.', { public: metadataPublic });
};

export const mwPatchProjectMetadataVisibility = async (req, res, next) => {
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

   if (req.project.permissions !== 'leader') return responseSimple(res, 403, 'Forbidden');

   try {
      project.isPublic = !project.isPublic;
      await repoProjects.save(project);
      return responseData(res, 200, 'Project public status updated', {
         isPublic: project.isPublic,
      });
   } catch (e) {
      return responseSimple(res, 500, 'Cannot change project');
   }
};

export const mwPatchProjectMetadataSearchability = async (req, res, next) => {
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

   if (req.project.permissions !== 'leader') return responseSimple(res, 403, 'Forbidden');

   try {
      project.isSearchable = !project.isSearchable;
      await repoProjects.save(project);
      return responseData(res, 200, 'Project searchability status updated', {
         isPublic: project.isSearchable,
      });
   } catch (e) {
      return responseSimple(res, 500, 'Cannot change project');
   }
};

export const mwPatchProjectMetadataArchive = async (req, res, next) => {
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

   if (req.project.permissions !== 'leader') return responseSimple(res, 403, 'Forbidden');

   try {
      project.isArchived = !project.isArchived;
      await repoProjects.save(project);
      return responseData(res, 200, 'Project archive status updated', {
         isPublic: project.isArchived,
      });
   } catch (e) {
      return responseSimple(res, 500, 'Cannot change project');
   }
};
