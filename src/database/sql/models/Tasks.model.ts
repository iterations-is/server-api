/**
 * @file Tasks Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Iterations } from './Iterations.model';

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

   @Column({
      name: 'fk__iterations_id',
   })
   iterations_id: number;

   @ManyToOne(type => Iterations, iteration => iteration.tasks)
   @JoinColumn({
      name: 'fk__iterations_id',
   })
   iteration: Iterations;
}
