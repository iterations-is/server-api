/**
 * @file Projects API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import routeCategories from './projects/categories.router';
import routeCategory from './projects/category.router';

const express = require('express');
const router = express.Router();

router.use('/categories', routeCategories);
router.use('/category', routeCategory);

export default router;
