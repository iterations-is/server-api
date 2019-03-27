/**
 * @file Permissions Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany } from 'typeorm';
import { GlobalRoles } from './GlobalRoles.model';

@Entity()
@Unique(['namespace', 'key'])
export class Permissions {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      type: 'varchar',
      length: 40,
   })
   namespace: string;

   @Column({
      type: 'varchar',
      length: 80,
   })
   key: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   @ManyToMany(type => GlobalRoles, permissions => permissions.globalRoles)
   permissions: GlobalRoles[];
}
