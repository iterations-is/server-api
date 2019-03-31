/**
 * @file Iterations Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Projects } from './Projects';
import { Tasks } from './Tasks.model';
import { Snapshots } from './Snapshots.model';

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

   // Iteration belongs to project
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

   // Iterations has many tasks
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => Tasks, task => task.iteration)
   tasks: Tasks[];

   // Iteration has many snapshots
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => Snapshots, snapshot => snapshot.iteration)
   snapshots: Snapshots[];
}
