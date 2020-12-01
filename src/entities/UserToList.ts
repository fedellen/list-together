import {
  Entity,
  Column,
  PrimaryColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { List } from './List';
import { User } from './User';

export enum UserPrivileges {
  add = 'add',
  strike = 'strike',
  sort = 'sort',
  delete = 'delete'
}

@Entity()
export class UserToList extends BaseEntity {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  listId: string;

  @Column('simple-array')
  privileges: UserPrivileges[];

  @ManyToOne(() => List, (list) => list.userConnection, { primary: true })
  @JoinColumn({ name: 'listID' })
  list: List;

  @ManyToOne(() => User, (user) => user.listConnection, { primary: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
