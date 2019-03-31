/**
 * @file Snapshot States Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Snapshots } from './Snapshots.model';

@Entity()
export class SnapshotStates {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      type: 'varchar',
      length: 40,
      unique: true,
   })
   name: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // Snapshots
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => Snapshots, snapshot => snapshot.state)
   snapshots: Snapshots[];
}
