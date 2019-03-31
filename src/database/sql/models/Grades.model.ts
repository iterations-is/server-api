/**
 * @file Grades Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Snapshots } from './Snapshots.model';
import { Tasks } from './Tasks.model';

@Entity()
// @Unique(['namespace', 'key'])
export class Grades {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   points: number;

   @Column({
      type: 'text',
   })
   message: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // Grades belongs to snapshot
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__snapshots_id__belongs',
   })
   snapshotId: number;

   @ManyToOne(type => Snapshots, snapshots => snapshots.grades)
   @JoinColumn({
      name: 'fk__snapshots_id__belongs',
   })
   snapshot: Snapshots;

   // Grades belongs to task
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__tasks_id__grades',
   })
   taskId: number;

   @ManyToOne(type => Tasks, task => task.grades)
   @JoinColumn({
      name: 'fk__tasks_id__grades',
   })
   task: Tasks;
}
