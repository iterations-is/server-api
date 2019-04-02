/**
 * @file Projects API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import routeCategories from './projects/categories.router';
import routeCategory from './projects/category.router';
import permissions from '@middlewares/permissions.mw';
import { mwCreateProject } from "@middlewares/api/projects.mw";

const express = require('express');
const router = express.Router();

router.post('/', permissions(['project.create']), mwCreateProject);
router.use('/categories', routeCategories);
router.use('/category', routeCategory);

export default router;
