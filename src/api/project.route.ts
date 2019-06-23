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
   '/:id_project',
   mwPermissionsGlobal(['projects.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwDeleteProject,
);

// Metadata
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/metadata',
   mwPermissionsGlobal(['metadata.get']),
   mwPermissionsProject([]),
   mwGetProjectMetadata,
);
router.patch(
   '/:id_project/metadata/public',
   mwPermissionsGlobal(['metadata.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectMetadataPublic,
);
router.patch(
   '/:id_project/metadata/private',
   mwPermissionsGlobal(['metadata.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectMetadataPrivate,
);
router.patch(
   '/:id_project/metadata/searchability',
   mwPermissionsGlobal(['metadata.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectMetadataSearchability,
);
router.patch(
   '/:id_project/metadata/visibility',
   mwPermissionsGlobal(['metadata.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectMetadataVisibility,
);
router.patch(
   '/:id_project/metadata/archivation',
   mwPermissionsGlobal(['metadata.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectMetadataArchive,
);
router.patch(
   '/:id_project/metadata/tags',
   mwPermissionsGlobal(['metadata.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectMetadataTags,
);

// Snapshots
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration/snapshots/',
   mwPermissionsGlobal(['snapshots.get']),
   mwPermissionsProject([]),
   mwGetAllSnapshots,
);
router.post(
   '/:id_project/iteration/:id_iteration/snapshots',
   mwPermissionsGlobal(['snapshots.edit']),
   mwPermissionsProject([UserProjectRole.LEADER, UserProjectRole.CONTRIBUTOR]),
   mwCreateSnapshot,
);

// Snapshot
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration/snapshot/:id_snapshot',
   mwPermissionsGlobal(['snapshots.get']),
   mwPermissionsProject([]),
   mwGetSnapshot,
);
router.post(
   '/:id_project/iteration/:id_iteration/snapshot/:id_snapshot',
   mwPermissionsGlobal(['snapshots.edit']),
   mwPermissionsProject([UserProjectRole.LEADER, UserProjectRole.CONTRIBUTOR]),
   mwSendSnapshotForGrading,
);

// Grades
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration/snapshot/:id_snapshot/grades',
   mwPermissionsGlobal(['grades.get']),
   mwPermissionsProject([]),
   mwGetSnapshotGrades,
);
router.patch(
   '/:id_project/iteration/:id_iteration/snapshot/:id_snapshot/grades',
   mwPermissionsGlobal(['grades.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPermissionsIsAuthority,
   mwGradeSnapshot,
);

// Parts
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/parts',
   mwPermissionsGlobal(['parts.get']),
   mwPermissionsProject([]),
   mwGetParts,
   //
);
router.post(
   '/:id_project/parts',
   mwPermissionsGlobal(['parts.edit']),
   mwPermissionsProject([UserProjectRole.LEADER, UserProjectRole.CONTRIBUTOR]),
   mwCreatePart,
);

// Part
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/part/:id_part',
   mwPermissionsGlobal(['parts.get']),
   mwPermissionsProject([]),
   mwGetPart,
);
router.patch(
   '/:id_project/part/:id_part',
   mwPermissionsGlobal(['parts.edit']),
   mwPermissionsProject([UserProjectRole.LEADER, UserProjectRole.CONTRIBUTOR]),
   mwUpdatePart,
);
router.delete(
   '/:id_project/part/:id_part',
   mwPermissionsGlobal(['parts.edit']),
   mwPermissionsProject([UserProjectRole.LEADER, UserProjectRole.CONTRIBUTOR]),
   mwRemovePart,
);

// Part completes tasks
// -----------------------------------------------------------------------------
router.patch(
   '/:id_project/part/:id_part/completes',
   mwPermissionsGlobal(['parts.edit']),
   mwPermissionsProject([UserProjectRole.LEADER, UserProjectRole.CONTRIBUTOR]),
   mwPartCompleteTasks,
);

// Roles
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/roles',
   mwPermissionsGlobal(['contributors.get']),
   mwPermissionsProject([]),
   mwGetProjectRoles,
   //
);
router.post(
   '/:id_project/roles',
   mwPermissionsGlobal(['contributors.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwCreateProjectRole,
);
router.patch(
   '/:id_project/roles/contributors',
   mwPermissionsGlobal(['contributors.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPatchProjectFreeContributors,
);

// Role
// -----------------------------------------------------------------------------
router.patch(
   '/:id_project/role/:id_role',
   mwPermissionsGlobal(['contributors.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwUpdateProjectRole,
);
router.delete(
   '/:id_project/role/:id_role',
   mwPermissionsGlobal(['contributors.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwDeleteProjectRole,
);

// Team
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/team',
   mwPermissionsGlobal(['team.get']),
   mwPermissionsProject([]),
   mwGetProjectTeam,
);
router.post(
   '/:id_project/team',
   mwPermissionsGlobal(['team.join']),
   mwPermissionsProject([]),
   mwJoinProjectTeam,
);
router.delete(
   '/:id_project/team',
   mwPermissionsGlobal(['team.leave']),
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
   mwPermissionsGlobal(['team.assign']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwPermissionsIsAuthority,
   mwAssignUserToProjectTeam,
);
router.delete(
   '/:id_project/team/user',
   mwPermissionsGlobal(['team.remove']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwRemoveUserFromProjectTeam,
);

// Iterations
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iterations',
   mwPermissionsGlobal(['iterations.get']),
   mwPermissionsProject([]),
   mwGetProjectIterations,
);
router.post(
   '/:id_project/iterations',
   mwPermissionsGlobal(['iterations.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwCreateProjectIterations,
);

// Iteration
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration',
   mwPermissionsGlobal(['iterations.get']),
   mwPermissionsProject([]),
   mwGetProjectIteration,
);
router.patch(
   '/:id_project/iteration/:id_iteration',
   mwPermissionsGlobal(['iterations.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwUpdateProjectIteration,
);
router.delete(
   '/:id_project/iteration/:id_iteration',
   mwPermissionsGlobal(['iterations.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwRemoveProjectIteration,
);

// Tasks
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration/tasks',
   mwPermissionsGlobal(['tasks.get']),
   mwPermissionsProject([]),
   mwGetProjectTasks,
);
router.post(
   '/:id_project/iteration/:id_iteration/tasks',
   mwPermissionsGlobal(['tasks.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwCreateProjectTask,
);

// Task
// -----------------------------------------------------------------------------
router.get(
   '/:id_project/iteration/:id_iteration/task/:id_task',
   mwPermissionsGlobal(['tasks.get']),
   mwPermissionsProject([]),
   mwGetProjectTask,
);
router.patch(
   '/:id_project/iteration/:id_iteration/task/:id_task',
   mwPermissionsGlobal(['tasks.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwUpdateProjectTask,
);
router.delete(
   '/:id_project/iteration/:id_iteration/task/:id_task',
   mwPermissionsGlobal(['tasks.edit']),
   mwPermissionsProject([UserProjectRole.LEADER]),
   mwRemoveProjectTask,
);

export default router;
