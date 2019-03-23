/**
 * @file Pages Router - Main file for pages routing. E.g. special authorization pages.
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

export {};
const express = require('express');
const router = express.Router();
const routerGithub = require('./github/github.router');

// Routes
router.use('/github', routerGithub);

module.exports = router;
