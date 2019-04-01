/**
 * @file ProjectCategoriesModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { ProjectsModel } from './Projects.model';

@Entity({
   name: 'project_categories',
})
@Unique(['name'])
export class ProjectCategoriesModel {
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

   // Categories have projects
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => ProjectsModel, project => project.category)
   projects: ProjectsModel[];
}
