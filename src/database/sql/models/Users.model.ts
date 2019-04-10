/**
 * @file UsersModel
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
import { GlobalRolesModel } from './GlobalRoles.model';
import { ProjectRolesModel } from './ProjectRoles.model';
import { NotificationsModel } from './Notifications.model';
import { SnapshotsModel } from './Snapshots.model';

@Entity({
   name: 'users',
})
@Unique(['authId', 'authType'])
@Unique(['authUsername'])
export class UsersModel {
   // ----------------------------------------------------------------------------------------------
   // Attributes
   // ----------------------------------------------------------------------------------------------

   @PrimaryGeneratedColumn()
   id: number;

   @Column({
      name: 'auth_id',
      type: 'int',
   })
   authId: number;

   @Column({
      name: 'auth_type',
      type: 'varchar',
      length: 255,
   })
   authType: string;

   @Column({
      name: 'auth_username',
      type: 'varchar',
      length: 255,
      nullable: true,
   })
   authUsername: string;

   @Column({
      name: 'auth_name',
      type: 'varchar',
      length: 255,
      nullable: true,
   })
   authName: string;

   // ----------------------------------------------------------------------------------------------
   // Relations
   // ----------------------------------------------------------------------------------------------

   // User global role
   // ----------------------------------------------------------------------------------------------
   @ManyToOne(type => GlobalRolesModel, role => role.users, {
      nullable: false,
   })
   @JoinColumn({
      name: 'fk__global_roles_id',
   })
   role: GlobalRolesModel;

   // User project roles
   // ----------------------------------------------------------------------------------------------
   @ManyToMany(type => ProjectRolesModel, projectRoles => projectRoles.users)
   @JoinTable({
      name: 'user_has_project_roles',
      joinColumns: [{ name: 'fk__users_id' }],
      inverseJoinColumns: [{ name: 'fk__project_roles_id' }],
   })
   projectRoles: ProjectRolesModel[];

   // NotificationsModel
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => NotificationsModel, notification => notification.user)
   notifications: NotificationsModel[];

   // SnapshotsModel
   // ----------------------------------------------------------------------------------------------
   @OneToMany(type => SnapshotsModel, snapshot => snapshot.createdBy)
   snapshotsCreated: SnapshotsModel[];

   @OneToMany(type => SnapshotsModel, snapshot => snapshot.sentBy)
   snapshotsSent: SnapshotsModel[];

   @OneToMany(type => SnapshotsModel, snapshot => snapshot.gradedBy)
   snapshotsGraded: SnapshotsModel[];
}
