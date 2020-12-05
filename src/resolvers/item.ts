import { Item, ItemHistory, UserToList } from '../entities';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';

@Resolver()
export class ItemResolver {
  // Send single item only when connection already exists from front
  // Otherwise items will be sent in arrays to save on requests
  @Mutation(() => UserToList)
  async addItem(
    @Arg('name') nameInput: string,
    @Arg('listId') listId: string,
    @Arg('userId') userId: string
  ): Promise<UserToList> {
    // find the list
    const userToListTable = await getRepository(UserToList).findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items', 'itemHistory']
    });
    if (!userToListTable)
      throw new Error('Could not find that user to list connection..');

    const list = userToListTable.list;
    if (list.items) {
      // Handle itemExists condition on the front end
      // This provides security for synchronization conflicts
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
}
