import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';

import { logger } from '../middleware/logger';

import { MyContext } from '../MyContext';
import { validateContext } from './types/validators/validateContext';

import { List, User, UserToList } from '../entities';

import { ShareListInput } from './types/input/ShareListInput';
import { StringArrayInput } from './types/input/StringArrayInput';
import { RemovalOrderInput } from './types/input/RemovalOrderInput';

import { UserToListResponse } from './types/response/UserToListResponse';
import { ListResponse } from './types/response/ListResponse';
import { BooleanResponse } from './types/response/BooleanResponse';
import { UserResponse } from './types/response/UserResponse';

@Resolver()
export class ListResolver {
  // Gets only the specified user's lists
  @UseMiddleware(logger)
  @Query(() => UserToListResponse)
  async getUsersLists(@Ctx() context: MyContext): Promise<UserToListResponse> {
    const errors = validateContext(context);
    if (errors) return { errors };

    const userToList = await UserToList.find({
      where: { userId: context.req.session.userId },
      relations: ['list', 'list.items', 'itemHistory']
    });

    if (!userToList) {
      return {
        errors: [
          {
            field: 'userId',
            message: 'Could not find any lists for that userId..'
          }
        ]
      };
    }

    return { userToList };
  }

  // Create a list
  @UseMiddleware(logger)
  @Mutation(() => ListResponse)
  async createList(
    @Arg('title') title: string,
    @Ctx() context: MyContext
  ): Promise<ListResponse> {
    const errors = validateContext(context);
    if (errors) return { errors };

    // Check to see if user already owns 25 lists
    const userToListTableArray = await UserToList.find({
      where: { userId: context.req.session.userId }
    });
    const userToListTablesAsOwner = userToListTableArray.filter(
      (listConnection) => listConnection.privileges.includes('owner')
    );

    if (userToListTablesAsOwner.length >= 25) {
      return {
        errors: [
          {
            field: 'lists',
            message: 'User cannot create more than 25 lists..'
          }
        ]
      };
    }

    // Make the list 👌
    const list = await List.create({
      title
    }).save();
    await UserToList.create({
      listId: list.id,
      userId: context.req.session.userId,
      privileges: ['owner']
    }).save();
    return { list };
  }

  // Share a list
  @UseMiddleware(logger)
  @Mutation(() => BooleanResponse)
  async shareList(
    @Arg('data') data: ShareListInput,
    @Ctx() context: MyContext
  ): Promise<BooleanResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: data.listId, userId: userId }
    });

    if (!userToListTable) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'User to list connection does not exist..'
          }
        ]
      };
    } else if (!userToListTable.privileges.includes('owner')) {
      return {
        errors: [
          {
            field: 'userToList',
            message: 'User does not have rights to share that list..'
          }
        ]
      };
    }

    const userToShare = await User.findOne({ where: { email: data.email } });
    if (!userToShare) {
      return {
        errors: [
          {
            field: 'email',
            message: 'A user with that email address does not exist..'
          }
        ]
      };
    }

    await UserToList.create({
      listId: data.listId,
      privileges: data.privileges,
      userId: userToShare.id
    }).save();

    return { boolean: true };
  }

  @UseMiddleware(logger)
  @Mutation(() => BooleanResponse)
  async deleteList(
    @Arg('listId') listId: string,
    @Ctx() context: MyContext
  ): Promise<BooleanResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    const userId = context.req.session.userId;

    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId }
    });

    if (!userToListTable) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'User to list connection does not exist..'
          }
        ]
      };
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

    return { boolean: true };
  }

  // Rename List
  @UseMiddleware(logger)
  @Mutation(() => ListResponse)
  async renameList(
    @Arg('name') name: string,
    @Arg('listId') listId: string,
    @Ctx() context: MyContext
  ): Promise<ListResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { userId: userId, listId: listId },
      relations: ['list']
    });

    if (!userToListTable) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'User to list connection does not exist..'
          }
        ]
      };
    } else if (!userToListTable.privileges.includes('owner')) {
      return {
        errors: [
          {
            field: 'userToList',
            message: 'User does not have rights to rename that list..'
          }
        ]
      };
    }

    userToListTable.list.title = name;
    await userToListTable.save();

    // Server saves and returns array
    return { list: userToListTable.list };
  }

  // Authenticated users can save the following arrays regardless of their accuracy
  // Accuracy/synchronization conflicts will be handled on the front-end
  // Sorted list/item arrays are never used in the back-end for any purpose
  // Only storage of user's preferences

  // Sorted Lists -- the order that the lists are displayed
  @UseMiddleware(logger)
  @Mutation(() => UserResponse)
  async sortLists(
    @Arg('data') sortedlistsInput: StringArrayInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    // Authorized user sends array of listIds
    const userId = context.req.session.userId;
    const user = await User.findOne(userId);

    if (!user) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'User does not exist..'
          }
        ]
      };
    }

    const sortedListsArray = sortedlistsInput.stringArray;
    user.sortedListsArray = sortedListsArray;

    await user.save();
    return { user };
  }

  // Re-order list -- save the user's order of the items on a list
  // User will also submit their `autoSortedList` through this mutation
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async sortItems(
    @Arg('data') sortedItemsInput: StringArrayInput,
    @Arg('listId') listId: string,
    @Ctx() context: MyContext
  ): Promise<UserToListResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };
    // Authorized user sends array of item names, and the listId
    const userId = context.req.session.userId;
    const userToList = await UserToList.findOne({
      where: { listId: listId, userId: userId }
    });
    if (!userToList) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'User to list connection does not exist..'
          }
        ]
      };
    }

    const sortedItemsArray = sortedItemsInput.stringArray;
    userToList.sortedItems = sortedItemsArray;

    await userToList.save();
    return { userToList: [userToList] };
  }

  // Submit and merge removalOrder results for Auto-Sort feature
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async submitRemovalOrder(
    @Arg('data') { removedItemArray, listId }: RemovalOrderInput,
    @Ctx() context: MyContext
  ): Promise<UserToListResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    // Authorized user sends array of item names, and the listId
    const userId = context.req.session.userId;
    const userToList = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['itemHistory']
    });

    if (!userToList) {
      return {
        errors: [
          {
            field: 'listId',
            message: 'User to list connection does not exist..'
          }
        ]
      };
    }

    const itemHistory = userToList.itemHistory;
    if (!itemHistory) {
      return {
        errors: [
          {
            field: 'itemHistory',
            message: 'User has no item history..'
          }
        ]
      };
    }

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

    await userToList.save();
    return { userToList: [userToList] };
  }
}
