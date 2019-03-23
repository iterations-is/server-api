import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Projects } from '@sqlmodels/Projects';

@Entity()
export class Tags {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      type: 'varchar',
      length: 40,
      unique: true,
   })
   name: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   @ManyToMany(type => Projects, projects => projects.tags)
   projects: Projects[];
}
