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
    const sortedHistory = parent.itemHistory.sort(
      (a, b) => b.timesAdded - a.timesAdded
    );
    return sortedHistory.map((history) => history.item);
  }

  /** Overly complicated sharedUsers field for list owners to manage privileges */
  /** Also handles whether or not the user should subscribe to the list for updates */
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
