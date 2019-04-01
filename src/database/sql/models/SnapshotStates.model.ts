/**
 * @file SnapshotStatesModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { SnapshotsModel } from './Snapshots.model';

@Entity({
   name: 'snapshot_states',
})
@Unique(['name'])
export class SnapshotStatesModel {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      name: 'name',
      type: 'varchar',
      length: 255,
   })
   name: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // SnapshotsModel
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => SnapshotsModel, snapshot => snapshot.state)
   snapshots: SnapshotsModel[];
}
