/**
 * @file PermissionsModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany } from 'typeorm';
import { GlobalRolesModel } from './GlobalRoles.model';

@Entity({
   name: 'permissions',
})
@Unique(['namespace', 'key'])
export class PermissionsModel {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      name: 'namespace',
      type: 'varchar',
      length: 255,
   })
   namespace: string;

   @Column({
      name: 'key',
      type: 'varchar',
      length: 255,
   })
   key: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // Global roles have permissions
   // ----------------------------------------------------------------------------------------------
   @ManyToMany(type => GlobalRolesModel, permissions => permissions.globalRoles)
   permissions: GlobalRolesModel[];
}
