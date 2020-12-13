import { Item, ItemHistory, UserToList } from '../entities';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { logger } from '../middleware/logger';
import { MyContext } from '../types/MyContext';
import { StringArrayInput } from './input-types/StringArrayInput';
import { StyleItemsInput } from './input-types/StyleItemsInput';
import { AddNotesInput } from './input-types/AddNotesInput';

@Resolver()
export class ItemResolver {
  // Send single item only when connection already exists from front
  // Otherwise action list state should be sent as one object?
  @UseMiddleware(isAuth, logger)
  @Mutation(() => UserToList)
  async addItem(
    @Arg('name') nameInput: string,
    @Arg('listId') listId: string,
    @Ctx() { req }: MyContext
  ): Promise<UserToList> {
    const userId = req.session.userId;
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
      if (list.items.length >= 300)
        throw new Error('Lists cannot have more than 300 items..');

      // Handle itemExists condition on the front end
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

    if (userToListTable.sortedItems) {
      // Add item to front of sorted list
      userToListTable.sortedItems = [nameInput, ...userToListTable.sortedItems];
    }

    await userToListTable.save();
    return userToListTable;
  }

  // Delete item from list

  @UseMiddleware(isAuth, logger)
  @Mutation(() => UserToList)
  async deleteItems(
    @Arg('itemIds') { stringArray }: StringArrayInput,
    @Arg('listId') listId: string,
    @Ctx() { req }: MyContext
  ): Promise<UserToList> {
    const userId = req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items', 'itemHistory']
    });

    if (!userToListTable) {
      throw new Error('Could not find that user to list connection..');
    } else if (
      !userToListTable.privileges.includes('owner') &&
      !userToListTable.privileges.includes('delete')
    ) {
      throw new Error(
        'User does not have privileges to delete items from that list..'
      );
    } else if (!userToListTable.list.items) {
      throw new Error('List has no items to delete..');
    }

    // String array of itemIds
    stringArray.forEach((itemId) => {
      const itemExists = userToListTable.list.items!.find(
        ({ id }) => id === itemId
      );
      if (!itemExists) throw new Error('Item does not exists on this list..');

      if (userToListTable.sortedItems) {
        // Remove items from sorted list
        console.log('before filter');
        userToListTable.sortedItems.filter((item) => item !== itemExists.name);
        console.log('after filter');
      }
      itemExists.remove();
    });

    await userToListTable.save();
    return userToListTable;
  }

  // Style items on list
  @UseMiddleware(isAuth, logger)
  @Mutation(() => UserToList)
  async styleItems(
    @Arg('styleItemsInput') { listId, itemIdStyle }: StyleItemsInput,
    @Ctx() { req }: MyContext
  ): Promise<UserToList> {
    const userId = req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items']
    });

    if (!userToListTable) {
      throw new Error('Could not find that user to list connection..');
    } else if (
      !userToListTable.privileges.includes('owner') &&
      !userToListTable.privileges.includes('delete')
    ) {
      throw new Error(
        'User does not have privileges to delete items from that list..'
      );
    } else if (!userToListTable.list.items) {
      throw new Error('List has no items to delete..');
    }

    itemIdStyle.forEach((itemIdStyle) => {
      const itemExists = userToListTable.list.items!.find(
        ({ id }) => id === itemIdStyle.itemId
      );
      if (!itemExists) throw new Error('Item does not exists on this list..');

      if (itemIdStyle.style === 'bold') {
        itemExists.bold = !itemExists.bold;
      } else if (itemIdStyle.style === 'strike') {
        if (
          !userToListTable.privileges.includes('owner') &&
          !userToListTable.privileges.includes('strike')
        ) {
          throw new Error(
            'User does not have privileges to strike items from that list..'
          );
        } else {
          itemExists.strike = !itemExists.strike;
        }
      }
    });

    await userToListTable.save();
    return userToListTable;
  }

  // Add note to item on list
  @UseMiddleware(isAuth, logger)
  @Mutation(() => UserToList)
  async addNotes(
    @Arg('itemIds') { listId, itemIdNote }: AddNotesInput,
    @Ctx() { req }: MyContext
  ): Promise<UserToList> {
    const userId = req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items']
    });

    if (!userToListTable) {
      throw new Error('Could not find that user to list connection..');
    } else if (!userToListTable.list.items) {
      throw new Error('List has no items to add notes to..');
    }

    itemIdNote.forEach((itemIdNote) => {
      const itemExists = userToListTable.list.items!.find(
        ({ id }) => id === itemIdNote.itemId
      );
      if (!itemExists) {
        throw new Error('Item does not exists on this list..');
      } else if (!itemExists.notes) {
        itemExists.notes = [itemIdNote.note];
      } else {
        itemExists.notes = [...itemExists.notes, itemIdNote.note];
      }
    });

    await userToListTable.save();
    return userToListTable;
  }
}
