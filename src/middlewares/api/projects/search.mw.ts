/**
 * @file Search
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */
import { getConnection } from '@utils/typeorm.util';
import { ProjectsModel } from '@modelsSQL/Projects.model';
import { validateRequestJoi } from '@utils/validator.util';
import { responseData } from '@utils/response.util';

const joi = require('joi');

export const mwSearchProjects = async (req, res, next) => {
   // Request data validation
   const schemas = {
      body: joi.object().keys({
         category: joi.number().required(),
         isArchived: joi.boolean().required(),
         isPublic: joi.boolean().required(),
         hasOpenVacancies: joi.boolean().required(),
      }),
      params: null,
   };
   const { isValidRequest, verbose } = validateRequestJoi(schemas, req.body, req.params);
   if (!isValidRequest) return responseData(res, 422, 'Invalid data.', verbose);

   const connection = getConnection();
   const repoProjects = connection.getRepository(ProjectsModel);

   try {
      const projects = await repoProjects.find({
         where: {
            categoryId: req.body.category,
            isArchived: req.body.isArchived,
            isPublic: req.body.isPublic,
            hasOpenVacancies: req.body.hasOpenVacancies,
            isSearchable: true,
            isDeleted: false,
         },
         select: ['id', 'descriptionPublic', 'isArchived', 'isPublic', 'hasOpenVacancies'],
         relations: ['tags', 'category'],
      });

      return responseData(res, 200, 'Found projects', { query: req.body, projects });
   } catch (e) {}
};
