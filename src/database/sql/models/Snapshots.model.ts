/**
 * @file Snapshots Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Iterations } from './Iterations.model';
import { Users } from './Users.model';
import { SnapshotStates } from './SnapshotStates.model';
import { Grades } from './Grades.model';

@Entity()
export class Snapshots {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   // @Column({
   //    name: 'date_graded',
   //    type: 'date',
   // })
   // dateGraded: Date;

   @Column({
      name: 'parts_list_json',
      type: 'text',
   })
   partsListJson: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // Snapshot has state
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__snapshot_states_id',
   })
   stateId: number;

   @ManyToOne(type => SnapshotStates, snapshotState => snapshotState.snapshots)
   @JoinColumn({
      name: 'fk__snapshot_states_id',
   })
   state: SnapshotStates;

   // Snapshot belongs to iteration
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__iterations_id__belongs',
   })
   iterationsId: number;

   @ManyToOne(type => Iterations, iteration => iteration.snapshots)
   @JoinColumn({
      name: 'fk__iterations_id__belongs',
   })
   iteration: Iterations;

   // Snapshot is created by
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__users_id__created_by',
   })
   createdByUserId: number;

   @ManyToOne(type => Users, user => user.snapshotsCreated)
   @JoinColumn({
      name: 'fk__users_id__created_by',
   })
   createdBy: Users;

   // Snapshot is sent by
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__users_id__sent_by',
   })
   sentByUserId: number;

   @ManyToOne(type => Users, user => user.snapshotsSent)
   @JoinColumn({
      name: 'fk__users_id__sent_by',
   })
   sentBy: Users;

   // Snapshot is graded by
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__users_id__graded_by',
   })
   gradedByUserId: number;

   @ManyToOne(type => Users, user => user.snapshotsGraded)
   @JoinColumn({
      name: 'fk__users_id__graded_by',
   })
   gradedBy: Users;

   // Grades
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => Grades, grade => grade.snapshot)
   grades: Grades[];
}
