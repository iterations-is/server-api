/**
 * @file TasksModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   Column,
   Entity,
   JoinColumn,
   ManyToMany,
   ManyToOne,
   OneToMany,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { IterationsModel } from './Iterations.model';
import { PartsModel } from './Parts.model';
import { GradesModel } from './Grades.model';

@Entity({
   name: 'tasks',
})
export class TasksModel {
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
      name: 'description',
      type: 'text',
      nullable: true,
   })
   description: string;

   @Column({
      name: 'points_min',
   })
   pointsMin: number;

   @Column({
      name: 'points_max',
   })
   pointsMax: number;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // TasksModel belongs to iteration
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__iterations_id__belongs',
   })
   iterations_id: number;

   @ManyToOne(type => IterationsModel, iteration => iteration.tasks)
   @JoinColumn({
      name: 'fk__iterations_id__belongs',
   })
   iteration: IterationsModel;

   // PartsModel completes tasks
   // ----------------------------------------------------------------------------------------------
   @ManyToMany(type => PartsModel, part => part.tasks)
   parts: PartsModel[];

   // GradesModel
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => GradesModel, grade => grade.snapshot)
   grades: GradesModel[];
}
