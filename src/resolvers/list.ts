import { List, User, UserToList } from '../entities';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { ShareListInput } from './input-types/ShareListInput';
import { MyContext } from '../types/MyContext';
import { StringArrayInput } from './input-types/StringArrayInput';
import { RemovalOrderInput } from './input-types/RemovalOrderInput';
import { logger } from 'src/middleware/logger';

@Resolver()
export class ListResolver {
  // Gets only the specified user's lists
  @UseMiddleware(isAuth, logger)
  @Query(() => [UserToList])
  async getUsersLists(@Ctx() { req }: MyContext): Promise<UserToList[]> {
    // if (!req.session.userId) throw new Error('No user in context..');
    const usersListArray = await UserToList.find({
      where: { userId: req.session.userId },
      relations: ['list', 'list.items', 'itemHistory']
    });
    if (!usersListArray) throw new Error('No lists were found for that User..');

    return usersListArray;
  }

  // Create a list
  @UseMiddleware(isAuth, logger)
  @Mutation(() => List)
  async createList(
    @Arg('title') title: string,
    @Ctx() { req }: MyContext
  ): Promise<List> {
    // Check to see if user already owns 25 lists
    const userToListTableArray = await UserToList.find({
      where: { userId: req.session.userId }
    });
    const userToListTablesAsOwner = userToListTableArray.filter(
      (listConnection) => listConnection.privileges.includes('owner')
    );

    if (userToListTablesAsOwner.length >= 25)
      throw new Error('User cannot create more than 25 lists..');

    // Make the list 👌
    const list = await List.create({
      title
    }).save();
    await UserToList.create({
      listId: list.id,
      userId: req.session.userId,
      privileges: ['owner']
    }).save();
    return list;
  }

  // Share a list
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Boolean)
  async shareList(
    @Arg('data') { email, listId, privileges }: ShareListInput,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const userId = req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId }
    });

    if (!userToListTable) {
      throw new Error('Cannot find that list connection..');
    } else if (!userToListTable.privileges.includes('owner')) {
      throw new Error('You do not have owner privileges to that list..');
    }

    const userToShare = await User.findOne({ where: { email } });
    if (!userToShare) {
      throw new Error('A user with that email address does not exist..');
    }

    await UserToList.create({
      listId,
      privileges,
      userId: userToShare.id
    }).save();
    return true;
  }

  @UseMiddleware(isAuth, logger)
  @Mutation(() => Boolean)
  async deleteList(
    @Arg('listId') listId: string,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const userId = req.session.userId;

    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId }
    });

    if (!userToListTable) {
      throw new Error('Cannot find that list connection..');
    }

    await userToListTable.remove();

    const listInDatabase = await List.findOne(listId, {
      relations: ['userConnection']
    });

    if (listInDatabase) {
      if (listInDatabase.userConnection.length === 0) {
        // Remove list from database if no User Connections
        await listInDatabase.remove();
      } else {
        const remainingUsersArray = listInDatabase.userConnection;
        const isOwnerExist = remainingUsersArray.filter((userToList) =>
          userToList.privileges.includes('owner')
        );

        if (isOwnerExist.length === 0) {
          // If no owner of list exists, give owner privileges to next user
          const newOwnerUserToListTable = await UserToList.findOne({
            where: { userId: remainingUsersArray[0].userId, listId: listId }
          });
          newOwnerUserToListTable!.privileges = ['owner'];
          await newOwnerUserToListTable!.save();
        }
      }
    }

    return true;
  }

  // Rename List
  @UseMiddleware(isAuth, logger)
  @Mutation(() => List)
  async renameList(
    @Arg('name') name: string,
    @Arg('listId') listId: string,
    @Ctx() { req }: MyContext
  ): Promise<List> {
    const userId = req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { userId: userId, listId: listId },
      relations: ['list']
    });

    if (!userToListTable)
      throw new Error('User to list connection does not exist..');
    else if (!userToListTable.privileges.includes('owner'))
      throw new Error('User does not have privileges to rename that list..');

    userToListTable.list.title = name;
    await userToListTable.save();

    // Server saves and returns array
    return userToListTable.list;
  }

  // Authenticated users can save the following arrays regardless of their accuracy
  // Accuracy/synchronization conflicts will be handled on the front-end
  // Sorted arrays are never used in the back-end for any purpose, only storage

  // Sorted Lists -- the order that the lists are displayed
  @UseMiddleware(isAuth, logger)
  @Mutation(() => User)
  async sortLists(
    @Arg('data') sortedlistsInput: StringArrayInput,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    // Authorized user sends array of listIds
    const userId = req.session.userId;
    const user = await User.findOne(userId);

    if (!user) throw new Error('User does not exist..');

    const sortedListsArray = sortedlistsInput.stringArray;
    user.sortedListsArray = sortedListsArray;

    return user.save();
  }

  // Re-order list -- save the user's order of the items on a list
  // User will also submit their `autoSortedList` through this mutation
  @UseMiddleware(isAuth, logger)
  @Mutation(() => UserToList)
  async sortItems(
    @Arg('data') sortedItemsInput: StringArrayInput,
    @Arg('listId') listId: string,
    @Ctx() { req }: MyContext
  ): Promise<UserToList> {
    // Authorized user sends array of item names, and the listId
    const userId = req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId }
    });
    if (!userToListTable)
      throw new Error('User to list connection does not exist..');

    const sortedItemsArray = sortedItemsInput.stringArray;
    userToListTable.sortedItems = sortedItemsArray;

    return userToListTable.save();
  }

  // Submit and merge removalOrder results for Auto-Sort feature
  @UseMiddleware(isAuth, logger)
  @Mutation(() => UserToList)
  async submitRemovalOrder(
    @Arg('data') { removedItemArray, listId }: RemovalOrderInput,
    @Ctx() { req }: MyContext
  ): Promise<UserToList> {
    // Authorized user sends array of item names, and the listId
    const userId = req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['itemHistory']
    });

    if (!userToListTable)
      throw new Error('User to list connection does not exist..');

    const itemHistory = userToListTable.itemHistory;
    if (!itemHistory) throw new Error('User has no item history..');

    const arrayLengthRating = Math.round(1000 / removedItemArray.length);

    removedItemArray.forEach((item) => {
      const itemInHistory = itemHistory.find((i) => i.item === item);
      if (!itemInHistory) throw new Error('Item has no history..');

      const newRemovalRating = Math.round(
        removedItemArray.indexOf(item) * arrayLengthRating
      ).toString(); // Save number as a string in Postgres

      let existingRemovalRatings = itemInHistory.removalRatingArray;

      if (!existingRemovalRatings) {
        itemInHistory.removalRatingArray = [newRemovalRating];
      } else {
        // Only store last 10 ratings for `recent` shopping results
        // And to prevent an infinitely scaling array of data to store 👍
        if (existingRemovalRatings.length === 10)
          existingRemovalRatings.shift();

        itemInHistory.removalRatingArray!.push(newRemovalRating);
      }
    });

    return userToListTable.save();
  }
}
