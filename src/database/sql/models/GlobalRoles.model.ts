/**
 * @file GlobalRolesModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   Unique,
   ManyToMany,
   JoinTable,
   OneToMany,
} from 'typeorm';
import { PermissionsModel } from './Permissions.model';
import { UsersModel } from './Users.model';

@Entity({
   name: 'global_roles',
})
@Unique(['name'])
export class GlobalRolesModel {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      name: 'name',
      type: 'varchar',
      length: 255,
   })
   name: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // Users with Role
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => UsersModel, user => user.role)
   users: UsersModel[];

   // Global roles have permissions
   // ----------------------------------------------------------------------------------------------
   @ManyToMany(type => PermissionsModel, globalRoles => globalRoles.permissions)
   @JoinTable({
      name: 'role_has_permissions',
      joinColumns: [{ name: 'fk__global_roles_id' }],
      inverseJoinColumns: [{ name: 'fk__permissions_id' }],
   })
   globalRoles: PermissionsModel[];
}
