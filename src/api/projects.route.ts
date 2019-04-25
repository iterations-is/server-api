/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { mwPermissionsGlobal } from '@middlewares/permissions.mw';
import { mwCreateProject } from '@middlewares/api/projects.mw';
import {
   mwCreateProjectCategory,
   mwGetProjectCategories,
} from '@middlewares/api/projects/categories.mw';
import {
   mwDeleteProjectCategory,
   mwPatchProjectCategory,
} from '@middlewares/api/projects/category.mw';
import { mwSearchProjects } from '@middlewares/api/projects/search.mw';

const express = require('express');
const router = express.Router();

// Projects
// -------------------------------------------------------------------------------------------------
router.post(
   '/',
   mwPermissionsGlobal(['projects.edit']),
   mwCreateProject,
   //
);

// Categories
// -----------------------------------------------------------------------------
router.get(
   '/categories/',
   mwPermissionsGlobal(['categories.get']),
   mwGetProjectCategories,
   //
);
router.post(
   '/categories/',
   mwPermissionsGlobal(['categories.edit']),
   mwCreateProjectCategory,
   //
);

// Category
// -----------------------------------------------------------------------------
router.patch(
   '/category/:id_category',
   mwPermissionsGlobal(['categories.edit']),
   mwPatchProjectCategory,
   //
);
router.delete(
   '/category/:id_category',
   mwPermissionsGlobal(['categories.edit']),
   mwDeleteProjectCategory,
   //
);

// Search
// -----------------------------------------------------------------------------
router.post(
   '/search',
   mwPermissionsGlobal(['search.get']),
   mwSearchProjects,
   //
);

export default router;
