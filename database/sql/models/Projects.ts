import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectCategories } from '@sqlmodels/ProjectCategories.model';
import { ProjectRoles } from '@sqlmodels/ProjectRoles.model';

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
}
