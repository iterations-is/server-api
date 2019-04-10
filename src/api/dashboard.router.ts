/**
 * @file Dashboard API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import permissions from '@middlewares/permissions.mw';
import { mwGetGlobalRoles, mwPatchUserGlobalRole } from '@middlewares/api/dashboard.mw';

const express = require('express');
const router = express.Router();

router.get('/roles', mwGetGlobalRoles);
router.patch('/role', permissions(['admin.change_user_role']), mwPatchUserGlobalRole);
export default router;
