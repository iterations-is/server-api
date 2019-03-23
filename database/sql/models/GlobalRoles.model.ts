import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   Unique,
   ManyToMany,
   JoinTable,
   OneToMany,
} from 'typeorm';
import { Permissions } from '@sqlmodels/Permissions.model';
import { Users } from '@sqlmodels/Users.model';

@Entity()
@Unique(['name'])
export class GlobalRoles {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      type: 'varchar',
      length: 40,
   })
   name: string;

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
