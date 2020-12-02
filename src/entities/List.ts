import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany
} from 'typeorm';
import { Item } from './Item';
import { UserToList } from './UserToList';
import { ItemHistory } from './ItemHistory';

@Entity('lists')
export class List extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @OneToMany(() => Item, (item) => item.list)
  items?: Item[];

  @OneToMany(() => ItemHistory, (itemHistory) => itemHistory.list)
  itemHistory?: ItemHistory[];

  @OneToMany(() => UserToList, (userToList) => userToList.list)
  userConnection: UserToList[];
}
