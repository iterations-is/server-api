import { TagsModel } from '@modelsSQL/Tags.model';
import logger from '@utils/logger.util';
import { responseData } from '@utils/response.util';
import { getConnection } from '@utils/typeorm.util';

/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

export const mwCreateProjectTags = async (req, res, next) => {
   // req.iterations.createProject.project

   const connection = getConnection();
   const repoTags = connection.getRepository(TagsModel);

   const tags: TagsModel[] = [];
   for (let tagName of req.body.tags) {
      let tag = new TagsModel();
      tag.name = tagName;
      tag.projects = [];
      try {
         await repoTags.save(tag);
         tags.push(tag);
         logger.info(`Tag "${tagName}" was created.`);
      } catch (e) {
         // So it exists
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
            logger.error(JSON.stringify(err));
            // So something is wrong...
            return responseData(res, 500, 'Cannot operate with tags.', {
               tagName: tag.name,
               err: err,
            });
         }
         logger.info(`Cannot create a tag "${tagName}".`);
      }
   }

   // Add created tags to project
   req.iterations.createProject.project.tags = tags;

   return next();
};
