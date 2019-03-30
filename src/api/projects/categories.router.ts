/**
 * @file Categories API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import permissions from '@middlewares/permissions.mw';
import { mwCreateProjectCategory, mwGetProjectCategories } from '@middlewares/api/categories.mw';

const express = require('express');
const router = express.Router();

router.get('/', mwGetProjectCategories);
router.post('/', permissions(['category.create']), mwCreateProjectCategory);
export default router;
