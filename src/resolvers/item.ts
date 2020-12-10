import { Item, ItemHistory, UserToList } from '../entities';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { logger } from '../middleware/logger';
import { MyContext } from '../types/MyContext';

@Resolver()
export class ItemResolver {
  // Send single item only when connection already exists from front
  // Otherwise list state should be sent as one object
  @UseMiddleware(isAuth, logger)
  @Mutation(() => UserToList)
  async addItem(
    @Arg('name') nameInput: string,
    @Arg('listId') listId: string,
    @Ctx() { req }: MyContext
  ): Promise<UserToList> {
    const userId = req.session.userId;
    console.log('here is the userId from item resolver: ', userId);
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items', 'itemHistory']
    });

    if (!userToListTable) {
      throw new Error('Could not find that user to list connection..');
    } else if (
      !userToListTable.privileges.includes('owner') &&
      !userToListTable.privileges.includes('add')
    ) {
      throw new Error(
        'User does not have privileges to add items to that list..'
      );
    }

    const list = userToListTable.list;
    if (list.items) {
      // Handle itemExists condition on the front end
      // This provides security for synchronization conflicts
      if (list.items.length >= 300)
        throw new Error('Lists cannot have more than 300 items..');

      const itemExists = list.items.find(({ name }) => name === nameInput);
      if (itemExists) throw new Error('Item already exists on this list..');

      list.items = [...list.items, Item.create({ name: nameInput })];
    } else {
      // Initialize list if no items --
      list.items = [Item.create({ name: nameInput })];
    }

    // Add item to User's personal item history for auto-completion and smart-sort
    if (userToListTable.itemHistory) {
      const existingItemInHistory = userToListTable.itemHistory.find(
        ({ item }) => item === nameInput
      );

      if (existingItemInHistory) {
        existingItemInHistory.timesAdded++;
      } else {
        userToListTable.itemHistory = [
          ...userToListTable.itemHistory,
          ItemHistory.create({ item: nameInput })
        ];
      }
    } else {
      // Initialize item history
      userToListTable.itemHistory = [ItemHistory.create({ item: nameInput })];
    }

    await userToListTable.save();
    return userToListTable;
  }

  // Delete item from list

  // Style item on list

  // Add note to item on list
}
