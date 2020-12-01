import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BaseEntity,
  OneToMany
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Item } from './Item';
import { UserToList } from './UserToList';
import { ItemHistory } from './ItemHistory';

@Entity('lists')
export class List extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @OneToMany(() => Item, (item) => item.list)
  items: Item[];

  @OneToMany(() => ItemHistory, (itemHistory) => itemHistory.list)
  itemHistory: ItemHistory[];

  @OneToMany(() => UserToList, (userToList) => userToList.list)
  userConnection: UserToList[];

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
