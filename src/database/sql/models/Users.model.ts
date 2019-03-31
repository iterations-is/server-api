/**
 * @file Users Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   Unique,
   ManyToOne,
   JoinColumn,
   ManyToMany,
   JoinTable,
   OneToMany,
} from 'typeorm';
import { GlobalRoles } from './GlobalRoles.model';
import { ProjectRoles } from './ProjectRoles.model';
import { Notifications } from './Notifications.model';
import { Snapshots } from './Snapshots.model';

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

   // User global role
   // ----------------------------------------------------------------------------------------------
   @ManyToOne(type => GlobalRoles, role => role.users, {
      nullable: false,
   })
   @JoinColumn({
      name: 'fk__global_roles_id',
   })
   role: GlobalRoles;

   // User project roles
   // ----------------------------------------------------------------------------------------------
   @ManyToMany(type => ProjectRoles, projectRoles => projectRoles.users)
   @JoinTable({
      name: 'user_has_project_roles',
      joinColumns: [{ name: 'fk__users_id' }],
      inverseJoinColumns: [{ name: 'fk__project_roles_id' }],
   })
   projectRoles: ProjectRoles[];

   // Notifications
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => Notifications, notification => notification.user)
   notifications: Notifications[];

   // Snapshots
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => Snapshots, snapshot => snapshot.createdBy)
   snapshotsCreated: Snapshots[];

   @OneToMany(type => Snapshots, snapshot => snapshot.sentBy)
   snapshotsSent: Snapshots[];

   @OneToMany(type => Snapshots, snapshot => snapshot.gradedBy)
   snapshotsGraded: Snapshots[];
}
