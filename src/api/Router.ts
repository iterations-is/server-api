/**
 * @file API Router - Main file for API routing
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import permissions from '@middlewares/permissions.mw';
import { mwEmpty } from '@middlewares/api/empty.mw';
import { mwGetGlobalRoles, mwPatchUserGlobalRole } from '@middlewares/api/dashboard.mw';
import { mwPingWithAuth, mwPingWithoutAuth } from '@middlewares/api/ping.mw';
import { mwDeleteNotification, mwPatchNotificationsRead } from '@middlewares/api/notification.mw';
import { mwGetUserNotifications } from '@middlewares/api/notifications.mw';
import { mwCreateProject, mwCreateProjectTransaction } from '@middlewares/api/projects.mw';
import { mwDeleteProject } from '@middlewares/api/project.mw';
import {
   mwCreateProjectCategory,
   mwGetProjectCategories,
} from '@middlewares/api/projects/categories.mw';
import {
   mwDeleteProjectCategory,
   mwPatchProjectCategory,
} from '@middlewares/api/projects/category.mw';
import {
   mwGetTokenPersistent,
   mwGetTokenTemporary,
   mwVerifyTokenPersistent,
} from '@middlewares/api/token.mw';
import { mwCreateProjectGlobalRoles } from '@middlewares/secondary/global-roles.mw';
import { mwCreateProjectTags } from '@middlewares/secondary/tags.mw';
import { mwCreateProjectIterations } from '@middlewares/secondary/iterations.mw';
import { mwSearchProjects } from '@middlewares/api/projects/search.mw';
import { mwGetProjectMetadata } from '@middlewares/api/project/metadata.mw';

const express = require('express');
const router = express.Router();

// Dashboard
// -------------------------------------------------------------------------------------------------
router.get('/dashboard/roles', mwGetGlobalRoles);
router.patch('/dashboard/role', permissions(['admin.change_user_role']), mwPatchUserGlobalRole);

// Notification
// -------------------------------------------------------------------------------------------------
router.patch(
   '/notification/:id_notification',
   permissions(['notifications.management']),
   mwPatchNotificationsRead,
);
router.delete(
   '/notification/:id_notification',
   permissions(['notifications.management']),
   mwDeleteNotification,
);

// Notifications
// -------------------------------------------------------------------------------------------------
router.get('/notifications', permissions(['notifications.management']), mwGetUserNotifications);

// Ping
// -------------------------------------------------------------------------------------------------
router.get('/ping/auth/with', mwPingWithAuth);
router.get('/ping/auth/without', mwPingWithoutAuth);

// Projects
// -------------------------------------------------------------------------------------------------
router.post(
   '/projects/',
   permissions(['project.create']),
   mwCreateProject,
   mwCreateProjectGlobalRoles,
   mwCreateProjectTags,
   mwCreateProjectIterations,
   mwCreateProjectTransaction,
);

// Categories
// -----------------------------------------------------------------------------
router.get('/projects/categories/', mwGetProjectCategories);
router.post('/projects/categories/', permissions(['category.create']), mwCreateProjectCategory);

// Category
// -----------------------------------------------------------------------------
router.patch(
   '/projects/category/:id_category',
   permissions(['category.edit']),
   mwPatchProjectCategory,
);
router.delete(
   '/projects/category/:id_category',
   permissions(['category.remove']),
   mwDeleteProjectCategory,
);

// Search
// -----------------------------------------------------------------------------
router.post('/projects/search', permissions(['project_search.search_projects']), mwSearchProjects);

// Project
// -------------------------------------------------------------------------------------------------
router.delete('/project/:id_project', permissions(['project.remove']), mwDeleteProject);

// Metadata
// -----------------------------------------------------------------------------
router.get('/project/:id_project/metadata', mwGetProjectMetadata);
router.patch(
   '/project/:id_project/metadata/public',
   permissions(['project_metadata.public']),
   mwEmpty,
);
router.patch(
   '/project/:id_project/metadata/private',
   permissions(['project_metadata.private']),
   mwEmpty,
);
router.patch(
   '/project/:id_project/metadata/searchability',
   permissions(['project_metadata.searchability']),
   mwEmpty,
);
router.patch(
   '/project/:id_project/metadata/visibility',
   permissions(['project_metadata.visibility']),
   mwEmpty,
);
router.patch(
   '/project/:id_project/metadata/archivation',
   permissions(['project_metadata.archivation']),
   mwEmpty,
);

// Snapshots
// -----------------------------------------------------------------------------
router.get('/project/:id_project/snapshots', permissions(['project_snapshots.get']), mwEmpty);
router.post(
   '/project/:id_project/snapshots',
   permissions(['project_snapshots.create_snapshot']),
   mwEmpty,
);

// Categories
// -----------------------------------------------------------------------------
router.get(
   '/project/:id_project/snapshot/:id_snapshot',
   permissions(['project_snapshot.get']),
   mwEmpty,
);
router.post(
   '/project/:id_project/snapshot/:id_snapshot',
   permissions(['project_snapshot.create']),
   mwEmpty,
);
router.patch(
   '/project/:id_project/snapshot/:id_snapshot',
   permissions(['project_snapshot.update']),
   mwEmpty,
);

// Roles
// -----------------------------------------------------------------------------
router.get('/project/:id_project/roles', permissions(['project_roles.get']), mwEmpty);
router.post('/project/:id_project/roles', permissions(['project_roles.create']), mwEmpty);
router.patch(
   '/project/:id_project/roles/contributors',
   permissions(['project_roles.update_free_contributors']),
   mwEmpty,
);
router.patch(
   '/project/:id_project/roles/visitors',
   permissions(['project_roles.update_free_visitors']),
   mwEmpty,
);

// Role
// -----------------------------------------------------------------------------
router.patch('/project/:id_project/role/:id_role', permissions(['project_role.update']), mwEmpty);
router.delete('/project/:id_project/role/:id_role', permissions(['project_role.remove']), mwEmpty);

// Team
// -----------------------------------------------------------------------------
router.get('/project/:id_project/team', permissions(['team.get']), mwEmpty);
router.post('/project/:id_project/team', permissions(['team.join']), mwEmpty);
router.delete('/project/:id_project/team', permissions(['team.leave']), mwEmpty);

// User
// ---------------------------------------------------------
router.post('/project/:id_project/team/user/:id_user', permissions(['team_user.assign']), mwEmpty);
router.patch(
   '/project/:id_project/team/user/:id_user',
   permissions(['team_user.update_role']),
   mwEmpty,
);
router.delete(
   '/project/:id_project/team/user/:id_user',
   permissions(['team_user.remove']),
   mwEmpty,
);

// Iterations
// -----------------------------------------------------------------------------
router.get('/project/:id_project/iterations', permissions(['iterations.get']), mwEmpty);
router.post(
   '/project/:id_project/iterations',
   permissions(['iterations.create_iteration']),
   mwEmpty,
);

// Iteration
// -----------------------------------------------------------------------------
router.get('/project/:id_project/iteration/:id_iteration', permissions(['iteration.get']), mwEmpty);
router.patch(
   '/project/:id_project/iteration/:id_iteration',
   permissions(['iteration.update']),
   mwEmpty,
);
router.delete(
   '/project/:id_project/iteration/:id_iteration',
   permissions(['iteration.delete']),
   mwEmpty,
);

// Tasks
// ---------------------------------------------------------
router.get(
   '/project/:id_project/iteration/:id_iteration/tasks',
   permissions(['project_tasks.get']),
   mwEmpty,
);
router.post(
   '/project/:id_project/iteration/:id_iteration/tasks',
   permissions(['project_tasks.create_task']),
   mwEmpty,
);

// Task
// ---------------------------------------------------------
router.get(
   '/project/:id_project/iteration/:id_iteration/task/:id_task',
   permissions(['project_task.get']),
   mwEmpty,
);
router.patch(
   '/project/:id_project/iteration/:id_iteration/task/:id_task',
   permissions(['project_task.update']),
   mwEmpty,
);
router.delete(
   '/project/:id_project/iteration/:id_iteration/task/:id_task',
   permissions(['project_task.delete']),
   mwEmpty,
);

// Token
// -------------------------------------------------------------------------------------------------
router.get('/token/temporary', mwGetTokenTemporary);
router.get('/token/persistent', mwGetTokenPersistent);
router.get('/token/verify', mwVerifyTokenPersistent);

export default router;
