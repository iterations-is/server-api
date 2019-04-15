import { MigrationInterface, QueryRunner } from 'typeorm';

export class snapshotstate1555328385745 implements MigrationInterface {
   public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`INSERT INTO snapshot_states (id, name) VALUES (1, 'Created');`);
      await queryRunner.query(`INSERT INTO snapshot_states (id, name) VALUES (2, 'Sent');`);
      await queryRunner.query(`INSERT INTO snapshot_states (id, name) VALUES (3, 'Graded');`);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {}
}
