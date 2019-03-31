/**
 * @file Tasks Model
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
import { Iterations } from './Iterations.model';
import { Parts } from './Parts.model';
import { Grades } from './Grades.model';

@Entity()
export class Tasks {
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

   @Column({
      name: 'points_value',
   })
   pointsValue: number;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // Tasks belongs to iteration
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__iterations_id__belongs',
   })
   iterations_id: number;

   @ManyToOne(type => Iterations, iteration => iteration.tasks)
   @JoinColumn({
      name: 'fk__iterations_id__belongs',
   })
   iteration: Iterations;

   // Parts completes tasks
   // ----------------------------------------------------------------------------------------------
   @ManyToMany(type => Parts, part => part.tasks)
   parts: Parts[];

   // Grades
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => Grades, grade => grade.snapshot)
   grades: Grades[];
}
