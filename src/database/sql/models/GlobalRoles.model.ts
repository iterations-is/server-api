/**
 * @file Global Roles Model
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
import { Permissions } from './Permissions.model';
import { Users } from './Users.model';

@Entity()
@Unique(['name'])
export class GlobalRoles {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      type: 'varchar',
      length: 40,
   })
   name: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   @OneToMany(type => Users, user => user.role)
   users: Users[];

   @ManyToMany(type => Permissions, globalRoles => globalRoles.permissions)
   @JoinTable({
      name: 'role_has_permissions',
      joinColumns: [{ name: 'fk__global_roles_id' }],
      inverseJoinColumns: [{ name: 'fk__permissions_id' }],
   })
   globalRoles: Permissions[];
}
