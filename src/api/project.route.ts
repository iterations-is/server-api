/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import routerProjectsIteration from './project.iteration.route';

import { mwEmpty } from '@middlewares/api/empty.mw';
import permissions from '@middlewares/permissions.mw';
import { mwDeleteProject } from '@middlewares/api/project.mw';
import {
   mwGetProjectMetadata,
   mwPatchProjectMetadataIsPublic,
} from '@middlewares/api/project/metadata.mw';
import { mwsStoreProjectPermissionsLevel } from '@middlewares/secondary/permissionsProject.mws';

const express = require('express');
const router = express.Router();

// Project
// -------------------------------------------------------------------------------------------------
router.delete('/', permissions([]), mwDeleteProject);

// Metadata
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/metadata',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwGetProjectMetadata,
);
router.patch(
   '/metadata/public',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwPatchProjectMetadataIsPublic,
);
router.patch('/metadata/private', permissions([]), mwEmpty);
router.patch('/metadata/searchability', permissions([]), mwEmpty);
router.patch('/metadata/visibility', permissions([]), mwEmpty);
router.patch('/metadata/archivation', permissions([]), mwEmpty);

// Snapshots
// -----------------------------------------------------------------------------
router.get('/snapshots', permissions([]), mwEmpty);
router.post('/snapshots', permissions([]), mwEmpty);

// Snapshot
// -----------------------------------------------------------------------------
router.get('/snapshot/:id_snapshot', permissions([]), mwEmpty);
router.post('/snapshot/:id_snapshot', permissions([]), mwEmpty);
router.patch('/snapshot/:id_snapshot', permissions([]), mwEmpty);

// Roles
// -----------------------------------------------------------------------------
router.get('/roles', permissions([]), mwEmpty);
router.post('/roles', permissions([]), mwEmpty);
router.patch('/roles/contributors', permissions([]), mwEmpty);
router.patch('/roles/visitors', permissions([]), mwEmpty);

// Role
// -----------------------------------------------------------------------------
router.patch('/role/:id_role', permissions([]), mwEmpty);
router.delete('/role/:id_role', permissions([]), mwEmpty);

// Team
// -----------------------------------------------------------------------------
router.get('/team', permissions([]), mwEmpty);
router.post('/team', permissions([]), mwEmpty);
router.delete('/team', permissions([]), mwEmpty);

// User
// ---------------------------------------------------------
router.post('/team/user/:id_user', permissions([]), mwEmpty);
router.patch('/team/user/:id_user', permissions([]), mwEmpty);
router.delete('/team/user/:id_user', permissions([]), mwEmpty);

// Iterations
// -----------------------------------------------------------------------------
router.get('/iterations', permissions([]), mwEmpty);
router.post('/iterations', permissions([]), mwEmpty);

// Iteration
// -----------------------------------------------------------------------------
router.use('/iteration/:id_iteration', routerProjectsIteration);

export default router;
