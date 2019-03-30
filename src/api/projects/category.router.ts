/**
 * @file Category API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import permissions from '@middlewares/permissions.mw';
import { mwDeleteProjectCategory, mwPatchProjectCategory } from '@middlewares/api/category.mw';

const express = require('express');
const router = express.Router();

router.patch('/:id_category', permissions(['category.edit']), mwPatchProjectCategory);
router.delete('/:id_category', permissions(['category.remove']), mwDeleteProjectCategory);
export default router;
