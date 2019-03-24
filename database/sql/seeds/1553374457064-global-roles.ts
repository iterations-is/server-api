import { MigrationInterface, QueryRunner } from 'typeorm';

export class globalRoles1553374457064 implements MigrationInterface {
   public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`
         INSERT INTO global_roles (id, name)
         VALUES (1, 'administrator');
      `);
      await queryRunner.query(`
         INSERT INTO global_roles (id, name)
         VALUES (2, 'user');
      `);
      await queryRunner.query(`
         INSERT INTO global_roles (id, name)
         VALUES (3, 'banned');
      `);
      await queryRunner.query(`
         INSERT INTO global_roles (id, name)
         VALUES (4, 'authority');
      `);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {}
}
