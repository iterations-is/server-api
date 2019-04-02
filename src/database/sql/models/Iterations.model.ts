/**
 * @file IterationsModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectsModel } from './Projects.model';
import { TasksModel } from './Tasks.model';
import { SnapshotsModel } from './Snapshots.model';

@Entity({
   name: 'iterations',
})
export class IterationsModel {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      name: 'title',
      type: 'text',
   })
   title: string;

   @Column({
      name: 'deadline',
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
   projectsId: number;

   @ManyToOne(type => ProjectsModel, projects => projects.iterations)
   @JoinColumn({
      name: 'fk__projects_id',
   })
   project: ProjectsModel;

   // IterationsModel has many tasks
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => TasksModel, task => task.iteration)
   tasks: TasksModel[];

   // Iteration has many snapshots
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => SnapshotsModel, snapshot => snapshot.iteration)
   snapshots: SnapshotsModel[];
}
