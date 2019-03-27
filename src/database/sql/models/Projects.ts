/**
 * @file Projects Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   Column,
   Entity,
   JoinColumn,
   JoinTable,
   ManyToMany,
   ManyToOne,
   OneToMany,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectCategories } from './ProjectCategories.model';
import { ProjectRoles } from './ProjectRoles.model';
import { Tags } from './Tags.model';

@Entity()
export class Projects {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      length: 200,
   })
   name: string;

   @Column({
      name: 'description_public',
      type: 'text',
   })
   descriptionPublic: string;

   @Column({
      name: 'description_private',
      type: 'text',
   })
   descriptionPrivate: string;

   @Column()
   isArchived: boolean;

   @Column()
   isSearchable: boolean;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   @ManyToOne(type => ProjectCategories, category => category.projects)
   @JoinColumn({
      name: 'fk__project_categories_id',
   })
   category: ProjectCategories;

   @OneToMany(type => ProjectRoles, role => role.project)
   roles: ProjectRoles[];

   @ManyToMany(type => Tags, tags => tags.projects)
   @JoinTable({
      name: 'project_has_tags',
      joinColumns: [{ name: 'fk__projects_id' }],
      inverseJoinColumns: [{ name: 'fk__tags_id' }],
   })
   tags: Tags[];
}
