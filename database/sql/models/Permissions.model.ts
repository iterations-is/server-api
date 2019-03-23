import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany } from 'typeorm';
import { GlobalRoles } from './GlobalRoles.model';

@Entity()
@Unique(['namespace', 'key'])
export class Permissions {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      type: 'varchar',
      length: 40,
   })
   namespace: string;

   @Column({
      type: 'varchar',
      length: 80,
   })
   key: string;

   @ManyToMany(type => GlobalRoles, permissions => permissions.globalRoles)
   permissions: GlobalRoles[];
}
