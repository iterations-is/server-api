import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({
   name: 'users',
})
@Unique(['auth_id', 'auth_type'])
export class Users {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      type: 'int',
      nullable: false,
   })
   auth_id: number;

   @Column()
   auth_type: string;

   @Column()
   auth_username: string;

   @Column({
      nullable: true,
   })
   auth_name: string;
}
