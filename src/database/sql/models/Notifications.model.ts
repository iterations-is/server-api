/**
 * @file NotificationsModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   ManyToOne,
   JoinColumn,
   CreateDateColumn,
} from 'typeorm';
import { UsersModel } from './Users.model';

@Entity({
   name: 'notifications',
})
export class NotificationsModel {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      name: 'message',
      type: 'text',
   })
   message: string;

   @Column({
      name: 'read_state',
      type: 'boolean',
   })
   isRead: boolean;

   @CreateDateColumn({
      name: 'created_at',
      type: 'timestamptz',
   })
   createdAt: Date;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   @Column({
      name: 'fk__users_id',
   })
   userId: number;

   @ManyToOne(type => UsersModel, user => user.notifications)
   @JoinColumn({
      name: 'fk__users_id',
   })
   user: UsersModel;
}
