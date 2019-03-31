/**
 * @file Parts Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tasks } from './Tasks.model';

@Entity()
export class Parts {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      name: 'nosql_id',
      type: 'text',
      unique: true,
   })
   nosqlId: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // Parts completes tasks
   // ----------------------------------------------------------------------------------------------
   @ManyToMany(type => Tasks, task => task.parts)
   @JoinTable({
      name: 'parts_completes_tasks',
      joinColumns: [{ name: 'fk__parts_id' }],
      inverseJoinColumns: [{ name: 'fk__tasks_id' }],
   })
   tasks: Tasks[];
}
