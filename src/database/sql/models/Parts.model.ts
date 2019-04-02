/**
 * @file PartsModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TasksModel } from './Tasks.model';

@Entity({
   name: 'parts',
})
@Unique(['nosqlId'])
export class PartsModel {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      name: 'nosql_id',
      type: 'text',
   })
   nosqlId: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // PartsModel completes tasks
   // ----------------------------------------------------------------------------------------------
   @ManyToMany(type => TasksModel, task => task.parts)
   @JoinTable({
      name: 'parts_completes_tasks',
      joinColumns: [{ name: 'fk__parts_id' }],
      inverseJoinColumns: [{ name: 'fk__tasks_id' }],
   })
   tasks: TasksModel[];
}
