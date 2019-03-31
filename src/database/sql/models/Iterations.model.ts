/**
 * @file Iterations Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Projects } from './Projects';

@Entity()
export class Iterations {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      type: 'text',
   })
   title: string;

   @Column({
      type: 'date',
   })
   deadline: Date;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   @Column({
      name: 'fk__projects_id',
   })
   projects_id: number;

   @ManyToOne(type => Projects, projects => projects.iterations)
   @JoinColumn({
      name: 'fk__projects_id',
   })
   project: Projects;
}
