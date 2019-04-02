/**
 * @file Project API Router
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import permissions from '@middlewares/permissions.mw';
import { mwDeleteProject } from "@middlewares/api/project.mw";

const express = require('express');
const router = express.Router();

router.delete('/:id_project', permissions(['project.remove']), mwDeleteProject);

export default router;
