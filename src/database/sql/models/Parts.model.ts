/**
 * @file Parts Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
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
   nosqlID: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   @ManyToMany(type => Tasks, task => task.parts)
   tasks: Tasks[];
}
