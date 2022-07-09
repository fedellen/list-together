import { UserToList, Item, ItemHistory } from '../entities';
import { SubscriptionPayload } from '../resolvers/types/subscription/SubscriptionPayload';
import { ItemName } from '../types';
import { Publisher } from 'type-graphql';
import { addToSharedLists } from './item/addToSharedLists';
import { recentlyAddedCallback } from './item/recentlyAddedCallback';
import { sortIntoList } from './item/sortIntoList';
import { UserToListBase, UserToListConstParams } from './UserToListHandler';
import fieldError from './fieldError';
import { parseStringInput } from '../utils/common';

interface AddItemHandlerConstParams extends UserToListConstParams {
  nameInput: ItemName[];
}
export class AddItemHandler extends UserToListBase {
  private nameInput: ItemName[];

  protected constructor({ nameInput, ...args }: AddItemHandlerConstParams) {
    super(args);

    this.nameInput = nameInput;
  }

  public static async initialize({
    nameInput,
    ...args
  }: AddItemHandlerConstParams): Promise<AddItemHandler> {
    const addItemHandler = new AddItemHandler({ nameInput, ...args });

    const userToListTable = await addItemHandler.getUserToListTable();
    if (!userToListTable) {
      throw fieldError.userToListTableDoesNotExist;
    }

    addItemHandler['userToListTable'] = userToListTable;
    addItemHandler.validateAddItemToList();

    return addItemHandler;
  }

  protected async getUserToListTable() {
    return super.getUserToListTable(['itemHistory', 'list', 'list.items']);
  }

  private validateAddItemToList(): void {
    this.validateUserToListTable();
    this.assertItemLimitOnList();
    this.parseNameInput();
    this.assertUniqueItemsOnList();
  }

  protected validateUserToListTable() {
    super.validateUserToListTable('add', false);
  }

  protected assertItemLimitOnList(): void {
    super.assertItemLimitOnList(this.nameInput.length);
  }

  private parseNameInput(): void {
    this.nameInput = this.nameInput.map((n) => parseStringInput(n));
  }

  private assertUniqueItemsOnList(): void {
    for (const itemName of this.nameInput) {
      super.assertUniqueItemOnList(itemName);
    }
  }

  public async addItems(
    publish: Publisher<SubscriptionPayload>
  ): Promise<UserToList> {
    for (const name of this.nameInput) {
      this.addItemToList(name);
      this.addItemToHistory(name);
      this.addToRecentlyAddedItems(name);
      this.addToUsersSortedItems(name);
    }

    addToSharedLists(this.userToListTable, this.nameInput, publish);
    await this.saveUserToTableCascadingAllListUpdates();
    return this.userToListTable;
  }

  private addItemToList(itemName: ItemName): void {
    if (this.listHasItems()) {
      this.addItemToExistingList(itemName);
    } else {
      this.initializeListWithItem(itemName);
    }
  }

  private listHasItems(): boolean {
    if (!this.items) {
      return false;
    }
    return this.items.length > 0;
  }

  private initializeListWithItem(itemName: ItemName) {
    this.userToListTable.list.items = [
      Item.create({ name: itemName, strike: this.striked })
    ];
  }

  private addItemToExistingList(itemName: ItemName) {
    this.userToListTable.list.items = [
      Item.create({ name: itemName, strike: this.striked }),
      ...this.items!
    ];
  }

  // TODO: Fix limitation below by adding striked to item add API
  // Front end only allows for bulk item names when using undo remove all
  private get striked() {
    return this.nameInput.length > 1;
  }

  private addItemToHistory(itemName: ItemName) {
    if (this.recentlyRemovedItems.includes(itemName)) {
      this.forgetReAddedItem(itemName);
    } else {
      this.insertIntoItemHistory(itemName);
    }
  }

  private forgetReAddedItem(itemName: ItemName) {
    this.userToListTable.removedItems = this.userToListTable.removedItems!.filter(
      (i) => i !== itemName
    );
  }

  private insertIntoItemHistory(itemName: ItemName) {
    if (!this.userToListTable.itemHistory) {
      this.initializeItemHistoryWithItem(itemName);
    } else {
      this.addItemToExistingHistory(itemName);
    }
  }

  private initializeItemHistoryWithItem(itemName: ItemName) {
    this.userToListTable.itemHistory = [ItemHistory.create({ item: itemName })];
  }

  private addItemToExistingHistory(itemName: ItemName) {
    const existingItemInHistory = this.getExistingItemFromHistory(itemName);

    if (existingItemInHistory !== undefined) {
      existingItemInHistory.timesAdded++;
    } else {
      this.addNewItemToItemHistory(itemName);
    }
  }

  private getExistingItemFromHistory(
    itemName: ItemName
  ): ItemHistory | undefined {
    return this.userToListTable.itemHistory?.find(
      ({ item }) => item === itemName
    );
  }

  private addNewItemToItemHistory(itemName: ItemName) {
    this.userToListTable.itemHistory = [
      ...this.userToListTable.itemHistory!,
      ItemHistory.create({ item: itemName })
    ];
  }

  private addToUsersSortedItems(itemName: ItemName) {
    this.userToListTable.sortedItems = sortIntoList(
      this.userToListTable,
      itemName,
      this.striked
    );
  }

  private addToRecentlyAddedItems(itemName: ItemName) {
    if (!this.userToListTable.recentlyAddedItems) {
      this.userToListTable.recentlyAddedItems = [itemName];
    } else {
      this.userToListTable.recentlyAddedItems = [
        ...this.userToListTable.recentlyAddedItems,
        itemName
      ];
    }

    this.triggerRecentlyAddedCallback(itemName);
  }

  private triggerRecentlyAddedCallback(itemName: ItemName): void {
    recentlyAddedCallback(this.userToListTable, itemName);
  }
}
