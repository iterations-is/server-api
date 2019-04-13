/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */
import { mwEmpty } from '@middlewares/api/empty.mw';
import permissions from '@middlewares/permissions.mw';

const express = require('express');
const router = express.Router();

// Iteration
// -------------------------------------------------------------------------------------------------
router.get('/', permissions([]), mwEmpty);
router.patch('/', permissions([]), mwEmpty);
router.delete('/', permissions([]), mwEmpty);

// Tasks
// -----------------------------------------------------------------------------
router.get('/tasks', permissions([]), mwEmpty);
router.post('/tasks', permissions([]), mwEmpty);

// Task
// -----------------------------------------------------------------------------
router.get('/task/:id_task', permissions([]), mwEmpty);
router.patch('/task/:id_task', permissions([]), mwEmpty);
router.delete('/task/:id_task', permissions([]), mwEmpty);

export default router;
