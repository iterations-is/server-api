/**
 * @file Search
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */
import { getConnection } from '@utils/typeorm.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';
import { validateRequestJoi } from '@utils/validator.util';
import { responseData } from '@utils/response.util';
import { UsersModel } from '@modelsSQL/Users.model';

const joi = require('joi');

export const mwSearchProjects = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         category: joi.number().optional(),
         isArchived: joi.boolean().optional(),
         isPublic: joi.boolean().optional(),
         hasOpenVacancies: joi.boolean().optional(),
         onlyUserProjects: joi.boolean().optional(),
      }),
      params: null,
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoProjects = connection.getRepository(ProjectsModel);
   const repoUsers = connection.getRepository(UsersModel);

   try {
      let where = {};
      if (req.body.category !== undefined) where['categoryId'] = req.body.category;
      if (req.body.isArchived !== undefined) where['isArchived'] = req.body.isArchived;
      if (req.body.isPublic !== undefined) where['isPublic'] = req.body.isPublic;
      if (req.body.hasOpenVacancies !== undefined)
         where['hasOpenVacancies'] = req.body.hasOpenVacancies;

      if (req.body.onlyUserProjects === true) {
         const user = await repoUsers
            .createQueryBuilder('user')
            .where({ id: req.jwt.userId })
            .leftJoinAndSelect('user.projectRoles', 'projectRoles')
            .leftJoinAndSelect('projectRoles.project', 'projects')
            .leftJoinAndSelect('projects.category', 'category')
            .leftJoinAndSelect('projects.tags', 'tags')
            .getMany();

         const projectRoles = user[0]['projectRoles'];
         const projects = [];
         for (let projectRole of projectRoles) {
            if (!projectRole.project.isDeleted) {
               projects.push(projectRole.project);
            }
         }

         return responseData(res, 200, 'Found projects', { query: req.body, projects: [projects] });
      }

      const projectsGlobal = await repoProjects.findAndCount({
         where: {
            ...where,
            isSearchable: true,
            isDeleted: false,
         },
         select: [
            'id',
            'name',
            'descriptionPublic',
            'isArchived',
            'isPublic',
            'hasOpenVacancies',
            'createdAt',
         ],
         relations: ['tags', 'category'],
      });

      return responseData(res, 200, 'Found projects', {
         query: req.body,
         projects: projectsGlobal,
      });
   } catch (e) {}
};
