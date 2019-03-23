import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { Projects } from '@sqlmodels/Projects';

@Entity()
@Unique(['name'])
export class ProjectCategories {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      type: 'varchar',
      length: 40,
   })
   name: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   @OneToMany(type => Projects, project => project.category)
   projects: Projects[];
}
