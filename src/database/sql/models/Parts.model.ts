/**
 * @file PartsModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   Column,
   Entity,
   JoinColumn,
   JoinTable,
   ManyToMany,
   ManyToOne,
   OneToMany,
   PrimaryGeneratedColumn,
   Unique,
} from 'typeorm';
import { TasksModel } from './Tasks.model';
import { ProjectsModel } from '@modelsSQL/Projects.model';

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

   @Column({
      name: 'snapshot_part',
      default: false,
   })
   isSnapshotPart: boolean;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // Parts belongs to project
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__projects_id',
   })
   projectsId: number;

   @ManyToOne(type => ProjectsModel, projects => projects.parts)
   @JoinColumn({
      name: 'fk__projects_id',
   })
   project: ProjectsModel;

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
