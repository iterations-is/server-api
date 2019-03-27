import { MigrationInterface, QueryRunner } from 'typeorm';

export class views1553458508330 implements MigrationInterface {
   public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`
        CREATE VIEW view_user_permissions
        AS (
            SELECT user_id, namespace AS permission_namespace, key AS key_namespace
            FROM (
                SELECT id AS user_id, fk__permissions_id
                FROM users AS u
                INNER JOIN role_has_permissions AS rhp ON u.fk__global_roles_id=rhp.fk__global_roles_id
            ) AS user_permissions
            INNER JOIN permissions AS p
            ON user_permissions.fk__permissions_id=p.id
        );
        `);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {}
}
