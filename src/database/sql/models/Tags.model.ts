/**
 * @file TagsModel
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ProjectsModel } from './Projects.model';

@Entity({
   name: 'tags',
})
@Unique(['name'])
export class TagsModel {
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

   // Tags have projects
   // ----------------------------------------------------------------------------------------------
   @ManyToMany(type => ProjectsModel, projects => projects.tags)
   projects: ProjectsModel[];
}
