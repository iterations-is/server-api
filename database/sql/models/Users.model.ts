import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { GlobalRoles } from '@sqlmodels/GlobalRoles.model';

@Entity({
   name: 'users',
})
@Unique(['auth_id', 'auth_type'])
export class Users {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      type: 'int',
   })
   auth_id: number;

   @Column({
      type: 'varchar',
      length: 40,
   })
   auth_type: string;

   @Column({
      type: 'varchar',
      length: 40,
      nullable: true,
   })
   auth_username: string;

   @Column({
      type: 'varchar',
      length: 80,
      nullable: true,
   })
   auth_name: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   @ManyToOne(type => GlobalRoles, role => role.users)
   @JoinColumn({
      name: 'fk__global_roles_id',
   })
   role: GlobalRoles;
}
