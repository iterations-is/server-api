import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable } from 'typeorm';
import { Permissions } from './Permissions.model';

@Entity()
@Unique(['name'])
export class GlobalRoles {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   name: string;

   @ManyToMany(type => Permissions, globalRoles => globalRoles.permissions)
   @JoinTable({
      name: 'role_has_permissions',
      joinColumns: [{ name: 'global_roles_id' }],
      inverseJoinColumns: [{ name: 'permissions_id' }],
   })
   globalRoles: Permissions[];
}
