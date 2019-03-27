import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialSeed1553374457064 implements MigrationInterface {
   // prettier-ignore
   public async up(queryRunner: QueryRunner): Promise<any> {
      // Default roles
      await queryRunner.query(`INSERT INTO global_roles (id, name) VALUES (1, 'administrator');`);
      await queryRunner.query(`INSERT INTO global_roles (id, name) VALUES (2, 'user');`);
      await queryRunner.query(`INSERT INTO global_roles (id, name) VALUES (3, 'banned');`);
      await queryRunner.query(`INSERT INTO global_roles (id, name) VALUES (4, 'authority');`);

      // Permissions
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (1, 'admin', 'change_user_role');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (2, 'admin', 'add_global_role');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (3, 'admin', 'change_permission_for_role');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (4, 'admin', 'change_authority');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (5, 'account', 'view_private_information');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (6, 'account', 'remove');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (7, 'notifications', 'management');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (8, 'project', 'create');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (9, 'project', 'remove');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (10, 'project', 'set_archive');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (11, 'project', 'change_metadata');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (12, 'project', 'manage_tags');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (13, 'category', 'create');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (14, 'category', 'edit');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (15, 'category', 'remove');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (16, 'project_team', 'manage_roles');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (17, 'project_team', 'add_user_to_team');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (18, 'project_team', 'change_user_team_role');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (19, 'project_team', 'remove_user_from_team');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (20, 'project_team', 'make_free_access_to_visitor_role');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (21, 'project_team', 'make_free_access_to_contributor_role');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (22, 'project_team', 'apply_for_a_vacancy');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (23, 'project_search', 'search_projects');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (24, 'project_search', 'make_project_searchable');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (25, 'project_iterations', 'edit_iterations_and_tasks');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (26, 'project_content', 'create_edit_remove');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (27, 'project_content', 'view');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (28, 'project_content', 'view_for_print');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (29, 'project_snapshots', 'create');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (30, 'project_snapshots', 'view');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (31, 'project_snapshots', 'remove');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (32, 'project_snapshots', 'send_for_grading');`);
      await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (33, 'project_snapshots', 'grade');`);

      // Admin permissions
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 1);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 2);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 3);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 4);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 5);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 6);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 7);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 8);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 9);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 10);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 11);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 12);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 13);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 14);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 15);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 16);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 17);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 18);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 19);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 20);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 21);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 22);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 23);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 24);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 25);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 26);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 27);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 28);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 29);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 30);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 31);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 32);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 33);`);

      // User permissions
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 5);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 6);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 7);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 8);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 9);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 10);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 11);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 12);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 13);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 14);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 15);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 16);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 17);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 18);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 19);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 20);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 21);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 22);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 23);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 24);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 25);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 26);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 27);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 28);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 29);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 30);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 31);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 32);`);
      await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 33);`);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {}
}
