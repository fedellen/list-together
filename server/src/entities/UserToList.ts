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

export type UserPrivileges = 'read' | 'add' | 'strike' | 'delete' | 'owner';

@ObjectType()
class SharedUsers {
  @Field()
  shared: boolean;
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  privileges?: UserPrivileges;
}

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

  @Field(() => String)
  @Column('text')
  privileges: UserPrivileges;

  @Field(() => [ItemHistory], { nullable: true })
  @OneToMany(() => ItemHistory, (itemHistory) => itemHistory.userToList, {
    cascade: true
  })
  itemHistory: ItemHistory[] | null;

  @Field(() => [String], { nullable: true })
  mostCommonWords(@Root() parent: UserToList): string[] | null {
    if (!parent.itemHistory) return null;
    // Sort by times added
    const sortedHistory = parent.itemHistory.sort(
      (a, b) => b.timesAdded - a.timesAdded
    );
    // Remove items already on list
    const itemsNotOnList = sortedHistory.filter(
      (history) => !parent.sortedItems?.includes(history.item)
    );
    return itemsNotOnList.map((history) => history.item);
  }

  /**
   *  Overly complicated sharedUsers field for list owners to manage privileges
   *  Also handles whether or not the user should subscribe to the list for updates
   */
  @Field(() => [SharedUsers])
  async sharedUsers(@Root() parent: UserToList): Promise<SharedUsers[]> {
    const sharedUserLists = (
      await UserToList.find({ where: { listId: parent.listId } })
    ).filter((userList) => userList.userId !== parent.userId);

    /** Return false if there are no sharedUsers */
    if (!sharedUserLists || sharedUserLists.length < 1) {
      return [{ shared: false }];
    }

    /** Return true when there are shared lists, but user is not owner of list */
    if (parent.privileges !== 'owner') {
      return [{ shared: true }];
    }

    /** Else get sharedUsers details for list owner to moderate */
    let sharedUserEmailsWithPrivileges: SharedUsers[] = [];
    await Promise.all(
      sharedUserLists.map(async (userList) => {
        const user = await User.findOne(userList.userId);
        if (user) {
          sharedUserEmailsWithPrivileges = [
            ...sharedUserEmailsWithPrivileges,
            { shared: true, email: user.email, privileges: userList.privileges }
          ];
        } // else a strange error has occured 🍕
      })
    );
    return sharedUserEmailsWithPrivileges;
  }

  /** Array of currently `smartSortable` items 😎 */
  @Field(() => [String])
  smartSortedItems(@Root() parent: UserToList): string[] {
    const itemArray = parent.list.items;
    const itemHistory = parent.itemHistory;
    if (!itemHistory) return [];
    const sortedArray = itemArray
      ?.sort((a, b) => {
        const aInHistory = itemHistory?.find(
          (history) => history.item === a.name
        );
        const aRating = a.strike
          ? 1000
          : aInHistory?.removalRating(aInHistory) || 500;
        const bInHistory = itemHistory?.find(
          (history) => history.item === b.name
        );
        const bRating = b.strike
          ? 1000
          : bInHistory?.removalRating(bInHistory) || 500;
        return aRating - bRating;
      })
      .map((i) => i.name);
    if (!sortedArray) return [];
    return sortedArray;
  }

  /** Recently added items to be used by undo functionality in the backend */
  @Column({ type: 'simple-array', nullable: true })
  recentlyAddedItems: string[] | null;

  // Front-end will send a sorted string array to store
  @Field(() => [String], { nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  sortedItems: string[] | null;

  @Column({ type: 'simple-array', nullable: true })
  removedItems: string[] | null;

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
