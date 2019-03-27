/**
 * @file Pages Router - Main file for pages routing. E.g. special authorization pages.
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import routerGithub from './github/github.router';

const express = require('express');
const router = express.Router();

// Routes
router.use('/github', routerGithub);

export default router;
