import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany } from 'typeorm';
import { GlobalRoles } from './GlobalRoles.model';

@Entity()
@Unique(['namespace', 'key'])
export class Permissions {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   namespace: string;

   @Column()
   key: string;

   @ManyToMany(type => GlobalRoles, permissions => permissions.globalRoles)
   permissions: GlobalRoles[];
}
