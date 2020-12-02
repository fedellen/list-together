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
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity('lists')
export class List extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column('text')
  title!: string;

  @Field()
  @OneToMany(() => Item, (item) => item.list, { cascade: true })
  items: Item[];

  @Field()
  @OneToMany(() => ItemHistory, (itemHistory) => itemHistory.list, {
    cascade: true
  })
  itemHistory: ItemHistory[];

  @OneToMany(() => UserToList, (userToList) => userToList.list)
  userConnection!: UserToList[];
}
