import { Field, ID, ObjectType, Root } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { List } from './';
import { User } from './';
import { ItemHistory } from './';

export type UserPrivileges = 'add' | 'strike' | 'delete' | 'owner';

// export enum UserPrivileges {
//   add = 'add',
//   strike = 'strike',
//   delete = 'delete',
//   owner = 'owner'
// }

// This is a Many to Many join table connecting a User to a List
// It is also the main point of entry for GraphQL List information
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
  @Column({ type: 'simple-array' })
  privileges: UserPrivileges[];

  @Field(() => [ItemHistory], { nullable: true })
  @OneToMany(() => ItemHistory, (itemHistory) => itemHistory.userToList, {
    cascade: true
  })
  itemHistory: ItemHistory[] | null;

  @Field(() => [String], { nullable: true })
  mostCommonWords(@Root() parent: UserToList): string[] | null {
    if (!parent.itemHistory) return null;
    const sortedHistory = parent.itemHistory.sort(
      (a, b) => b.timesAdded - a.timesAdded
    );
    return sortedHistory.map((history) => history.item);
  }

  @Field(() => [String], { nullable: true })
  autoSortedList(/*@Root() parent: UserToList*/): string[] | null {
    // Sorted list by `removalOrder`
    // Rating based on shopping trip removal order
    // Should Only store the information when items
    return null;
  }

  // Front-end will send a sorted string array to store
  @Field(() => [String], { nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  sortedItems: string[] | null;

  @Field(() => List)
  @ManyToOne(() => List, (list) => list.userConnection, {
    primary: true,
    cascade: true
  })
  @JoinColumn()
  list: List;

  @ManyToOne(() => User, (user) => user.listConnection, { primary: true })
  @JoinColumn()
  user: User;
}
