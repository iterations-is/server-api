import { MigrationInterface, QueryRunner } from 'typeorm';

export class permissions1555525324373 implements MigrationInterface {
   // prettier-ignore
   public async up(queryRunner: QueryRunner): Promise<any> {

        // Permissions
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (1,  'global_roles', 'get');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (2,  'global_roles', 'edit');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (3,  'notifications', 'get');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (4,  'notifications', 'edit');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (5,  'projects', 'manage');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (6,  'projects', 'edit');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (7,  'categories', 'get');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (8,  'categories', 'edit');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (9,  'search', 'get');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (11, 'metadata', 'get');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (12, 'metadata', 'edit');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (13, 'snapshots', 'get');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (14, 'snapshots', 'edit');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (15, 'grades', 'get');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (16, 'grades', 'edit');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (17, 'parts', 'get');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (18, 'parts', 'edit');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (19, 'contributors', 'get');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (20, 'contributors', 'edit');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (21, 'team', 'get');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (22, 'team', 'join');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (23, 'team', 'leave');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (24, 'team', 'assign');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (25, 'team', 'remove');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (26, 'iterations', 'get');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (27, 'iterations', 'edit');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (28, 'tasks', 'get');`);
        await queryRunner.query(`INSERT INTO permissions (id, namespace, key) VALUES (29, 'tasks', 'edit');`);

        // Admin permissions
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 1 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 2 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 3 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 4 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 5 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 6 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 7 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 8 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (1, 9 );`);
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

        // User permissions
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 1 );`);

        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 3 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 4 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 5 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 6 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 7 );`);

        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 9 );`);
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

        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 25);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 26);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 27);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 28);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (2, 29);`);

        // Banned permissions
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (3, 3 );`);

        // Authority permissions
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 1 );`);

        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 3 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 4 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 5 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 6 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 7 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 8 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 9 );`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 11);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 12);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 13);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 14);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 15);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 16);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 17);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 18);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 19);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 20);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 21);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 22);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 23);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 24);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 25);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 26);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 27);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 28);`);
        await queryRunner.query(`INSERT INTO role_has_permissions (fk__global_roles_id, fk__permissions_id) VALUES (4, 29);`);

    }

   public async down(queryRunner: QueryRunner): Promise<any> {}
}
