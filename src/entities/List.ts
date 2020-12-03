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
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity('lists')
export class List extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column('text')
  title!: string;

  @Field(() => [Item], { nullable: true })
  @OneToMany(() => Item, (item) => item.list, { cascade: true, nullable: true })
  items: Item[] | null;

  @Field(() => [ItemHistory])
  @OneToMany(() => ItemHistory, (itemHistory) => itemHistory.list, {
    cascade: true,
    nullable: true
  })
  itemHistory: ItemHistory[];

  @OneToMany(() => UserToList, (userToList) => userToList.list)
  userConnection!: UserToList[];
}
