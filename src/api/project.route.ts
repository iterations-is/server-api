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
} from '@middlewares/api/project/iterations.mw';
import {
   mwCreateProjectTask,
   mwGetProjectTask,
   mwGetProjectTasks,
   mwRemoveProjectTask,
   mwUpdateProjectTask,
} from '@middlewares/api/project/tasks.mw';
import {
   mwAssignUserToProjectTeam,
   mwGetProjectTeam,
   mwJoinProjectTeam,
   mwLeaveProjectTeam,
   mwRemoveUserFromProjectTeam,
} from '@middlewares/api/project/team.mw';
import { mwCreatePart, mwGetPart, mwGetParts } from '@middlewares/api/project/parts.mw';

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

// Parts
// -----------------------------------------------------------------------------
router.get('/:id_project/parts', permissions([]), mwsStoreProjectPermissionsLevel, mwGetParts);
router.post('/:id_project/parts', permissions([]), mwsStoreProjectPermissionsLevel, mwCreatePart);

// Part
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/part/:id_part',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwGetPart,
);
router.patch('/:id_project/part/:id_part', permissions([]), mwEmpty);
router.delete('/:id_project/part/:id_part', permissions([]), mwEmpty);

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
router.get('/:id_project/team', permissions([]), mwGetProjectTeam);
router.post('/:id_project/team', permissions([]), mwJoinProjectTeam);
router.delete(
   '/:id_project/team',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwLeaveProjectTeam,
);

// User
// ---------------------------------------------------------
router.post(
   '/:id_project/team/user',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwAssignUserToProjectTeam,
);
router.delete(
   '/:id_project/team/user',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwRemoveUserFromProjectTeam,
);

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
router.get(
   '/:id_project/iteration/:id_iteration/tasks',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwGetProjectTasks,
);
router.post(
   '/:id_project/iteration/:id_iteration/tasks',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwCreateProjectTask,
);

// Task
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration/task/:id_task',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwGetProjectTask,
);
router.patch(
   '/:id_project/iteration/:id_iteration/task/:id_task',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwUpdateProjectTask,
);
router.delete(
   '/:id_project/iteration/:id_iteration/task/:id_task',
   permissions([]),
   mwsStoreProjectPermissionsLevel,
   mwRemoveProjectTask,
);

export default router;
