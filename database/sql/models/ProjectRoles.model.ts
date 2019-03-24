import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   Unique,
   ManyToMany,
   ManyToOne,
   JoinColumn,
} from 'typeorm';
import { Projects } from './Projects';
import { Users } from './Users.model';

@Entity()
@Unique(['name'])
export class ProjectRoles {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   isEditable: boolean;

   @Column({
      type: 'varchar',
      length: 40,
   })
   name: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   @ManyToOne(type => Projects, project => project.roles)
   @JoinColumn({
      name: 'fk__projects_id',
   })
   project: Projects;

   @ManyToMany(type => Users, users => users.projectRoles)
   users: Users[];
}
