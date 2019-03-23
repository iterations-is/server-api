import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   Unique,
   ManyToOne,
   JoinColumn,
   ManyToMany,
   JoinTable,
} from 'typeorm';
import { GlobalRoles } from '@sqlmodels/GlobalRoles.model';
import { ProjectRoles } from '@sqlmodels/ProjectRoles.model';

@Entity({
   name: 'users',
})
@Unique(['auth_id', 'auth_type'])
export class Users {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      type: 'int',
   })
   auth_id: number;

   @Column({
      type: 'varchar',
      length: 40,
   })
   auth_type: string;

   @Column({
      type: 'varchar',
      length: 40,
      nullable: true,
   })
   auth_username: string;

   @Column({
      type: 'varchar',
      length: 80,
      nullable: true,
   })
   auth_name: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   @ManyToOne(type => GlobalRoles, role => role.users)
   @JoinColumn({
      name: 'fk__global_roles_id',
   })
   role: GlobalRoles;

   @ManyToMany(type => ProjectRoles, projectRoles => projectRoles.users)
   @JoinTable({
      name: 'user_has_project_roles',
      joinColumns: [{ name: 'fk__users_id' }],
      inverseJoinColumns: [{ name: 'fk__project_roles_id' }],
   })
   projectRoles: ProjectRoles[];
}
