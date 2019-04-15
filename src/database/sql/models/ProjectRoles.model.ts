/**
 * @file ProjectRolesModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   Unique,
   ManyToMany,
   ManyToOne,
   JoinColumn,
} from 'typeorm';
import { ProjectsModel } from './Projects.model';
import { UsersModel } from './Users.model';

@Entity({
   name: 'project_roles',
})
export class ProjectRolesModel {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      name: 'editable_state',
      type: 'boolean',
   })
   isEditable: boolean;

   @Column({
      name: 'name',
      type: 'varchar',
      length: 255,
   })
   name: string;

   @Column({
      name: 'capacity',
      default: 0,
   })
   capacity: number;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // Projects roles belongs to project
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__projects_id',
   })
   projectId: number;

   @ManyToOne(type => ProjectsModel, project => project.roles)
   @JoinColumn({
      name: 'fk__projects_id',
   })
   project: ProjectsModel;

   // Project role has users
   // ----------------------------------------------------------------------------------------------
   @ManyToMany(type => UsersModel, users => users.projectRoles)
   users: UsersModel[];
}
