/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */
import { ProjectRolesModel } from '@modelsSQL/ProjectRoles.model';

export const mwCreateProjectGlobalRoles = (req, res, next) => {
   // req.iterations.createProject.projectModel;
   // req.iterations.createProject.user;

   const roleLeaders = new ProjectRolesModel();
   roleLeaders.name = 'Leader';
   roleLeaders.isEditable = false;
   roleLeaders.project = req.iterations.createProject.project;
   roleLeaders.users = [req.iterations.createProject.user];

   const roleVisitors = new ProjectRolesModel();
   roleVisitors.name = 'Visitors';
   roleVisitors.isEditable = false;
   roleVisitors.project = req.iterations.createProject.project;

   req.iterations.createProject.roleLeaders = roleLeaders;
   req.iterations.createProject.roleVisitors = roleVisitors;

   return next();
};
