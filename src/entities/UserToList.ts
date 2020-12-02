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

export type UserPrivileges = 'add' | 'strike' | 'sort' | 'delete' | 'owner';

@Entity()
export class UserToList extends BaseEntity {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  listId: string;

  @Column('simple-array')
  privileges: UserPrivileges[];

  @ManyToOne(() => List, (list) => list.userConnection, { primary: true })
  @JoinColumn({ name: 'userId' })
  list: List;

  @ManyToOne(() => User, (user) => user.listConnection, { primary: true })
  @JoinColumn({ name: 'listId' })
  user: User;
}
