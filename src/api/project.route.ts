/**
 * @file
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { mwEmpty } from '@middlewares/api/empty.mw';
import permissions from '@middlewares/permissions.mw';
import { mwDeleteProject } from '@middlewares/api/project.mw';
import {
   mwGetProjectMetadata,
   mwPatchProjectMetadataArchive,
   mwPatchProjectMetadataVisibility,
   mwPatchProjectMetadataSearchability,
   mwPatchProjectMetadataPublic,
   mwPatchProjectMetadataPrivate,
   mwPatchProjectMetadataTags,
} from '@middlewares/api/project/metadata.mw';
import { mwsStoreProjectPermissionsLevel } from '@middlewares/secondary/permissionsProject.mws';
import {
   mwCreateProjectRole,
   mwDeleteProjectRole,
   mwGetProjectRoles,
   mwPatchProjectFreeContributors,
   mwUpdateProjectRole,
} from '@middlewares/api/project/roles.mw';
import {
   mwCreateProjectIterations,
   mwGetProjectIteration,
   mwGetProjectIterations,
   mwRemoveProjectIteration,
   mwUpdateProjectIteration,
} from '@middlewares/api/project/iterations';

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
   '/:id_project/metadata/public',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwPatchProjectMetadataPublic,
);
router.patch(
   '/:id_project/metadata/private',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwPatchProjectMetadataPrivate,
);
router.patch(
   '/:id_project/metadata/searchability',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwPatchProjectMetadataSearchability,
);
router.patch(
   '/:id_project/metadata/visibility',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwPatchProjectMetadataVisibility,
);
router.patch(
   '/:id_project/metadata/archivation',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwPatchProjectMetadataArchive,
);
router.patch(
   '/:id_project/metadata/tags',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwPatchProjectMetadataTags,
);

// Snapshots
// -----------------------------------------------------------------------------
router.get('/:id_project/snapshots', permissions([]), mwEmpty);
router.post('/:id_project/snapshots', permissions([]), mwEmpty);

// Snapshot
// -----------------------------------------------------------------------------
router.get('/:id_project/snapshot/:id_snapshot', permissions([]), mwEmpty);
router.post('/:id_project/snapshot/:id_snapshot', permissions([]), mwEmpty);
router.patch('/:id_project/snapshot/:id_snapshot', permissions([]), mwEmpty);

// Roles
// -----------------------------------------------------------------------------
router.get('/:id_project/roles', permissions([]), mwGetProjectRoles);
router.post(
   '/:id_project/roles',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwCreateProjectRole,
);
router.patch(
   '/:id_project/roles/contributors',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwPatchProjectFreeContributors,
);

// Role
// -----------------------------------------------------------------------------
router.patch(
   '/:id_project/role/:id_role',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwUpdateProjectRole,
);
router.delete(
   '/:id_project/role/:id_role',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwDeleteProjectRole,
);

// Team
// -----------------------------------------------------------------------------
router.get('/:id_project/team', permissions([]), mwEmpty);
router.post('/:id_project/team', permissions([]), mwEmpty);
router.delete('/:id_project/team', permissions([]), mwEmpty);

// User
// ---------------------------------------------------------
router.post('/:id_project/team/user/:id_user', permissions([]), mwEmpty);
router.patch('/:id_project/team/user/:id_user', permissions([]), mwEmpty);
router.delete('/:id_project/team/user/:id_user', permissions([]), mwEmpty);

// Iterations
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iterations',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwGetProjectIterations,
);
router.post(
   '/:id_project/iterations',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwCreateProjectIterations,
);

// Iteration
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration/',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwGetProjectIteration,
);
router.patch(
   '/:id_project/iteration/:id_iteration/',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwUpdateProjectIteration,
);
router.delete(
   '/:id_project/iteration/:id_iteration/',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwRemoveProjectIteration,
);

// Tasks
// -----------------------------------------------------------------------------
router.get('/:id_project/iteration/:id_iteration/tasks', permissions([]), mwEmpty);
router.post('/:id_project/iteration/:id_iteration/tasks', permissions([]), mwEmpty);

// Task
// -----------------------------------------------------------------------------
router.get('/:id_project/iteration/:id_iteration/task/:id_task', permissions([]), mwEmpty);
router.patch('/:id_project/iteration/:id_iteration/task/:id_task', permissions([]), mwEmpty);
router.delete('/:id_project/iteration/:id_iteration/task/:id_task', permissions([]), mwEmpty);

export default router;
