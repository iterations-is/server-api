/**
 * @file ProjectsModel
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
import { ProjectCategoriesModel } from './ProjectCategories.model';
import { ProjectRolesModel } from './ProjectRoles.model';
import { TagsModel } from './Tags.model';
import { IterationsModel } from './Iterations.model';

@Entity({
   name: 'projects',
})
export class ProjectsModel {
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

   @Column({
      name: 'archive_state',
      type: 'boolean',
   })
   isArchived: boolean;

   @Column({
      name: 'search_state',
      type: 'boolean',
   })
   isSearchable: boolean;

   @Column({
      name: 'public_state',
      type: 'boolean',
   })
   isPublic: boolean;

   @Column({
      name: 'vacancies_state',
      type: 'boolean',
   })
   hasOpenVacancies: boolean;

   @Column({
      name: 'delete_state',
      type: 'boolean',
   })
   isDeleted: boolean;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // Project has category
   // ----------------------------------------------------------------------------------------------
   @Column({
      name: 'fk__project_categories_id',
   })
   categoryId: number;

   @ManyToOne(type => ProjectCategoriesModel, category => category.projects)
   @JoinColumn({
      name: 'fk__project_categories_id',
   })
   category: ProjectCategoriesModel;

   // Project have project roles
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => ProjectRolesModel, role => role.project)
   roles: ProjectRolesModel[];

   // Tags
   // ----------------------------------------------------------------------------------------------
   @ManyToMany(type => TagsModel, tags => tags.projects)
   @JoinTable({
      name: 'project_has_tags',
      joinColumns: [{ name: 'fk__projects_id' }],
      inverseJoinColumns: [{ name: 'fk__tags_id' }],
   })
   tags: TagsModel[];

   // Iterations
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => IterationsModel, iteration => iteration.project)
   iterations: IterationsModel[];
}
