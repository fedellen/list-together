import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { List } from './';
import { User } from './';
import { ItemHistory } from './';

export type UserPrivileges = 'add' | 'strike' | 'sort' | 'delete' | 'owner';

// This is a Many to Many join table connecting a User to a List
@ObjectType()
@Entity()
export class UserToList extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  userId: string;

  @Field(() => ID)
  @PrimaryColumn('uuid')
  listId: string;

  @Field(() => [String])
  @Column({ type: 'simple-array', default: ['owner'] })
  privileges: UserPrivileges[];

  @Field(() => [ItemHistory], { nullable: true })
  @OneToOne(() => ItemHistory)
  @JoinColumn()
  itemHistory: ItemHistory[];

  @Field(() => [String], { nullable: true })
  mostCommonWords: string[] | null;

  @Field(() => [String], { nullable: true })
  autoSortedList: string[] | null;

  // Front-end will send a sorted string array to store
  @Field(() => [String], { nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  sortedItems: string[] | null;

  @Field(() => List)
  @ManyToOne(() => List, (list) => list.userConnection, { primary: true })
  @JoinColumn()
  list: List;

  @ManyToOne(() => User, (user) => user.listConnection, { primary: true })
  @JoinColumn()
  user: User;
}
