import { Item, ItemHistory, UserToList } from '../entities';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types/MyContext';
import { StyleItemInput } from './input-types/StyleItemsInput';
import { AddNoteInput } from './input-types/AddNoteInput';
import { AddItemInput } from './input-types/AddItemInput';
import { DeleteItemsInput } from './input-types/DeleteItemsInput';
import { RenameItemInput } from './input-types/RenameItemInput';
import { logger } from 'src/middleware/logger';

@Resolver()
export class ItemResolver {
  // Send single item only when connection already exists from front
  // Otherwise action list state should be sent as one object?
  @UseMiddleware(isAuth, logger)
  @Mutation(() => UserToList)
  async addItem(
    @Arg('data') { nameInput, listId }: AddItemInput,
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

    return userToListTable.save();
  }

  // Delete array of items from list
  // Items will usually be deleted in batches from front-end `deleteStrikes`
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Boolean)
  async deleteItems(
    @Arg('data') { itemNameArray, listId }: DeleteItemsInput,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
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

    itemNameArray.forEach((itemName) => {
      const itemExists = userToListTable.list.items!.find(
        ({ name }) => name === itemName
      );
      if (!itemExists) throw new Error('Item does not exists on this list..');

      if (userToListTable.sortedItems) {
        // Remove the deleted items from user's sorted list
        userToListTable.sortedItems = userToListTable.sortedItems.filter(
          (item) => item !== itemExists.name
        );
      }
      itemExists.remove();
    });

    await userToListTable.save();
    return true;
  }

  // Style items on list
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Item)
  async styleItem(
    @Arg('data') { listId, style, isStyled, itemName }: StyleItemInput,
    @Ctx() { req }: MyContext
  ): Promise<Item> {
    const userId = req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items']
    });

    if (!userToListTable) {
      throw new Error('Could not find that user to list connection..');
    } else if (!userToListTable.list.items) {
      throw new Error('List does not have items to style..');
    } else if (
      !userToListTable.privileges.includes('owner') &&
      !userToListTable.privileges.includes('strike') &&
      style === 'strike'
    ) {
      throw new Error(
        'User does not have privileges to strike items from that list..'
      );
    }

    const item = userToListTable.list.items.find(
      ({ name }) => name === itemName
    );
    if (!item) {
      throw new Error('Item does not exist on list..');
    }

    // Style the item
    if (style === 'bold') {
      item.bold = isStyled;
    } else {
      item.strike = isStyled;
    }

    await userToListTable.save();
    return item;
  }

  // Add note to item on list
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Item)
  async addNote(
    @Arg('data') { listId, note, itemName }: AddNoteInput,
    @Ctx() { req }: MyContext
  ): Promise<Item> {
    const userId = req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items']
    });

    if (!userToListTable) {
      throw new Error('Could not find that user to list connection..');
    } else if (!userToListTable.list.items) {
      throw new Error('List does not have items to add notes to..');
    } else if (
      !userToListTable.privileges.includes('owner') &&
      !userToListTable.privileges.includes('add')
    ) {
      throw new Error(
        'User does not have privileges to add notes to items on that list..'
      );
    }

    const item = userToListTable.list.items.find(
      ({ name }) => name === itemName
    );
    if (!item) {
      throw new Error('Item does not exist on list..');
    }

    if (!item.notes) {
      // Initialize notes for item
      item.notes = [note];
    } else {
      if (item.notes.length >= 10) {
        throw new Error('Items cannot have more than 10 notes..');
      }
      item.notes = [...item.notes, note];
    }

    return item.save();
  }

  // Rename item on list
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Item)
  async renameItem(
    @Arg('data') { listId, newName, itemName }: RenameItemInput,
    @Ctx() { req }: MyContext
  ): Promise<Item> {
    const userId = req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['list', 'list.items']
    });

    if (!userToListTable) {
      throw new Error('Could not find that user to list connection..');
    } else if (!userToListTable.list.items) {
      throw new Error('List does not have items to add notes to..');
    } else if (
      !userToListTable.privileges.includes('owner') &&
      !userToListTable.privileges.includes('add')
    ) {
      throw new Error(
        'User does not have privileges to rename items on that list..'
      );
    }

    const item = userToListTable.list.items.find(
      ({ name }) => name === itemName
    );
    if (!item) {
      throw new Error('Item does not exist on list..');
    }

    item.name = newName;

    return item.save();
  }
}
