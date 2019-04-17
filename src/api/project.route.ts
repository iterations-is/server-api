/**
 * @file Project API
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   mwPermissionsGlobal,
   mwPermissionsIsAuthority,
   mwPermissionsProject,
   UserProjectRole,
} from '@middlewares/permissions.mw';
import { mwDeleteProject } from '@middlewares/api/project.mw';
import {
   mwGetProjectMetadata,
   mwPatchProjectMetadataArchive,
   mwPatchProjectMetadataPrivate,
   mwPatchProjectMetadataPublic,
   mwPatchProjectMetadataSearchability,
   mwPatchProjectMetadataTags,
   mwPatchProjectMetadataVisibility,
} from '@middlewares/api/project/metadata.mw';
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
import {
   mwCreatePart,
   mwGetPart,
   mwGetParts,
   mwPartCompleteTasks,
   mwRemovePart,
   mwUpdatePart,
} from '@middlewares/api/project/parts.mw';
import {
   mwCreateSnapshot,
   mwGetAllSnapshots,
   mwGetSnapshot,
   mwGetSnapshotGrades,
   mwGradeSnapshot,
   mwSendSnapshotForGrading,
} from '@middlewares/api/project/snapshots.mw';

const express = require('express');
const router = express.Router();

// Project
// -------------------------------------------------------------------------------------------------
router.delete(
   '/',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwDeleteProject,
);

// Metadata
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/metadata',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwGetProjectMetadata,
);
router.patch(
   '/:id_project/metadata/public',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectMetadataPublic,
);
router.patch(
   '/:id_project/metadata/private',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectMetadataPrivate,
);
router.patch(
   '/:id_project/metadata/searchability',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectMetadataSearchability,
);
router.patch(
   '/:id_project/metadata/visibility',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectMetadataVisibility,
);
router.patch(
   '/:id_project/metadata/archivation',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectMetadataArchive,
);
router.patch(
   '/:id_project/metadata/tags',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectMetadataTags,
);

// Snapshots
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration/snapshots/',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwGetAllSnapshots,
);
router.post(
   '/:id_project/iteration/:id_iteration/snapshots',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER, UserProjectRole.CONTRIBUTOR]),
   mwCreateSnapshot,
);

// Snapshot
// -----------------------------------------------------------------------------

router.get(
   '/:id_project/iteration/:id_iteration/snapshot/:id_snapshot',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwGetSnapshot,
);
router.post(
   '/:id_project/iteration/:id_iteration/snapshot/:id_snapshot',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER, UserProjectRole.CONTRIBUTOR]),
   mwSendSnapshotForGrading,
);

// Grades
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration/snapshot/:id_snapshot/grades',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwGetSnapshotGrades,
);
router.patch(
   '/:id_project/iteration/:id_iteration/snapshot/:id_snapshot/grades',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPermissionsIsAuthority,
   mwGradeSnapshot,
);

// Parts
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/parts',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwGetParts,
   //
);
router.post(
   '/:id_project/parts',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER, UserProjectRole.CONTRIBUTOR]),
   mwCreatePart,
);

// Part
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/part/:id_part',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwGetPart,
);
router.patch(
   '/:id_project/part/:id_part',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER, UserProjectRole.CONTRIBUTOR]),
   mwUpdatePart,
);
router.delete(
   '/:id_project/part/:id_part',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER, UserProjectRole.CONTRIBUTOR]),
   mwRemovePart,
);

// Part completes tasks
// -----------------------------------------------------------------------------
router.patch(
   '/:id_project/part/:id_part/completes',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER, UserProjectRole.CONTRIBUTOR]),
   mwPartCompleteTasks,
);

// Roles
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/roles',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwGetProjectRoles,
   //
);
router.post(
   '/:id_project/roles',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwCreateProjectRole,
);
router.patch(
   '/:id_project/roles/contributors',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectFreeContributors,
);

// Role
// -----------------------------------------------------------------------------
router.patch(
   '/:id_project/role/:id_role',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwUpdateProjectRole,
);
router.delete(
   '/:id_project/role/:id_role',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwDeleteProjectRole,
);

// Team
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/team',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwGetProjectTeam,
);
router.post(
   '/:id_project/team',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwJoinProjectTeam,
);
router.delete(
   '/:id_project/team',
   mwPermissionsGlobal([]),
   mwPermissionsProject([
      UserProjectRole.LEADER,
      UserProjectRole.CONTRIBUTOR,
      UserProjectRole.VISITOR,
   ]),
   mwLeaveProjectTeam,
);

// User
// ---------------------------------------------------------
router.post(
   '/:id_project/team/user',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPermissionsIsAuthority,
   mwAssignUserToProjectTeam,
);
router.delete(
   '/:id_project/team/user',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwRemoveUserFromProjectTeam,
);

// Iterations
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iterations',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwGetProjectIterations,
);
router.post(
   '/:id_project/iterations',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwCreateProjectIterations,
);

// Iteration
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration/',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwGetProjectIteration,
);
router.patch(
   '/:id_project/iteration/:id_iteration/',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwUpdateProjectIteration,
);
router.delete(
   '/:id_project/iteration/:id_iteration/',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwRemoveProjectIteration,
);

// Tasks
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration/tasks',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwGetProjectTasks,
);
router.post(
   '/:id_project/iteration/:id_iteration/tasks',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwCreateProjectTask,
);

// Task
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration/task/:id_task',
   mwPermissionsGlobal([]),
   mwPermissionsProject([]),
   mwGetProjectTask,
);
router.patch(
   '/:id_project/iteration/:id_iteration/task/:id_task',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwUpdateProjectTask,
);
router.delete(
   '/:id_project/iteration/:id_iteration/task/:id_task',
   mwPermissionsGlobal([]),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwRemoveProjectTask,
);

export default router;
