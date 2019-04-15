/**
 * @file SnapshotsModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IterationsModel } from './Iterations.model';
import { UsersModel } from './Users.model';
import { SnapshotStatesModel } from './SnapshotStates.model';
import { GradesModel } from './Grades.model';

@Entity({
   name: 'snapshots',
})
export class SnapshotsModel {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      name: 'date_graded',
      type: 'date',
      nullable: true,
   })
   dateGraded: Date;

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

   @ManyToOne(type => SnapshotStatesModel, snapshotState => snapshotState.snapshots)
   @JoinColumn({
      name: 'fk__snapshot_states_id',
   })
   state: SnapshotStatesModel;

   // Snapshot belongs to iteration
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__iterations_id__belongs',
   })
   iterationsId: number;

   @ManyToOne(type => IterationsModel, iteration => iteration.snapshots)
   @JoinColumn({
      name: 'fk__iterations_id__belongs',
   })
   iteration: IterationsModel;

   // Snapshot is created by
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__users_id__created_by',
   })
   createdByUserId: number;

   @ManyToOne(type => UsersModel, user => user.snapshotsCreated)
   @JoinColumn({
      name: 'fk__users_id__created_by',
   })
   createdBy: UsersModel;

   // Snapshot is sent by
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__users_id__sent_by',
      nullable: true,
   })
   sentByUserId: number;

   @ManyToOne(type => UsersModel, user => user.snapshotsSent)
   @JoinColumn({
      name: 'fk__users_id__sent_by',
   })
   sentBy: UsersModel;

   // Snapshot is graded by
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__users_id__graded_by',
      nullable: true,
   })
   gradedByUserId: number;

   @ManyToOne(type => UsersModel, user => user.snapshotsGraded)
   @JoinColumn({
      name: 'fk__users_id__graded_by',
   })
   gradedBy: UsersModel;

   // GradesModel
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => GradesModel, grade => grade.snapshot)
   grades: GradesModel[];
}
