/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { validateRequestJoi } from '@utils/validator.util';
import { responseData, responseSimple } from '@utils/response.util';
import { getConnection } from '@utils/typeorm.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';
import { response } from 'express';
import { ProjectRolesModel } from '@modelsSQL/ProjectRoles.model';
import { ProjectCategoriesModel } from '@modelsSQL/ProjectCategories.model';
import { TagsModel } from '@modelsSQL/Tags.model';
import logger from '@utils/logger.util';

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

   if (req.project.permissions !== 'leader') return responseSimple(res, 403, 'Forbidden');

   const connection = getConnection();
   const repoProjects = connection.getRepository(ProjectsModel);

   let project: ProjectsModel;
   try {
      project = await repoProjects.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 409, 'Cannot get project.', {});
   }

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

   if (req.project.permissions !== 'leader') return responseSimple(res, 403, 'Forbidden');

   const connection = getConnection();
   const repoProjects = connection.getRepository(ProjectsModel);

   let project: ProjectsModel;
   try {
      project = await repoProjects.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 409, 'Cannot get project.', {});
   }

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

   if (req.project.permissions !== 'leader') return responseSimple(res, 403, 'Forbidden');

   const connection = getConnection();
   const repoProjects = connection.getRepository(ProjectsModel);

   let project: ProjectsModel;
   try {
      project = await repoProjects.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 409, 'Cannot get project.', {});
   }

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

export const mwPatchProjectMetadataPublic = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         categoryId: joi.number().required(),
         name: joi.string().required(),
         descriptionPublic: joi.string().required(),
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
   const repoCategory = connection.getRepository(ProjectCategoriesModel);
   const repoProject = connection.getRepository(ProjectsModel);

   let category;
   try {
      category = await repoCategory.findOneOrFail(req.body.categoryId);
   } catch (e) {
      return responseData(res, 400, 'Cannot find category', { categoryId: req.body.categoryId });
   }

   let project;
   try {
      project = await repoProject.findOneOrFail(req.params.id_project);
   } catch (e) {
      return responseData(res, 400, 'Cannot find project', { categoryId: req.body.categoryId });
   }

   // Save category
   project.category = category;
   // Save name
   project.name = req.body.name;
   // Save description public
   project.descriptionPublic = req.body.descriptionPublic;

   try {
      await repoProject.save(project);

      return responseData(res, 200, 'Project public data were updated', {});
   } catch (e) {
      return responseData(res, 400, 'Cannot save project public data', {});
   }
};

export const mwPatchProjectMetadataPrivate = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         descriptionPrivate: joi.string().required(),
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
      return responseData(res, 400, 'Cannot find project', {
         categoryId: req.body.categoryId,
      });
   }

   // Save description public
   project.descriptionPrivate = req.body.descriptionPrivate;

   try {
      await repoProject.save(project);

      return responseData(res, 200, 'Project private data were updated', {});
   } catch (e) {
      return responseData(res, 400, 'Cannot save project private data', {});
   }
};

export const mwPatchProjectMetadataTags = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         tags: joi
            .array()
            .required()
            .items(joi.string()),
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
      return responseData(res, 400, 'Cannot find project', {
         categoryId: req.body.categoryId,
      });
   }

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

   try {
      await repoProject.save(project);

      return responseData(res, 200, 'Tags were updated', {});
   } catch (e) {
      return responseData(res, 400, 'Cannot save project tags', {});
   }
};
