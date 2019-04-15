/**
 * @file GradesModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { SnapshotsModel } from './Snapshots.model';
import { TasksModel } from './Tasks.model';

@Entity({
   name: 'grades',
})
@Unique(['snapshotId', 'taskId'])
export class GradesModel {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      name: 'points',
      nullable: true,
   })
   points: number;

   @Column({
      name: 'message',
      type: 'text',
      nullable: true,
   })
   message: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // GradesModel belongs to snapshot
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__snapshots_id__belongs',
   })
   snapshotId: number;

   @ManyToOne(type => SnapshotsModel, snapshots => snapshots.grades)
   @JoinColumn({
      name: 'fk__snapshots_id__belongs',
   })
   snapshot: SnapshotsModel;

   // GradesModel belongs to task
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__tasks_id__grades',
   })
   taskId: number;

   @ManyToOne(type => TasksModel, task => task.grades)
   @JoinColumn({
      name: 'fk__tasks_id__grades',
   })
   task: TasksModel;
}
