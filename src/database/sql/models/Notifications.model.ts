/**
 * @file Notifications Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './Users.model';

@Entity()
export class Notifications {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      type: 'varchar',
   })
   message: string;

   @Column({
      name: 'is_read',
      type: 'boolean',
   })
   isRead: boolean;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   @Column({
      name: 'fk__users_id',
   })
   users_id: number;

   @ManyToOne(type => Users, user => user.notifications)
   @JoinColumn({
      name: 'fk__users_id',
   })
   user: Users;
}
