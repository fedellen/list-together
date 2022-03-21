import { maxItemLimitOnList } from '../constants';
import { UserToList, UserPrivileges } from '../entities';
import { ListId, ItemName } from '../types';
import fieldError from './fieldError';
import { UserBase, UserHandlerParams } from './UserHandler';

export interface UserToListConstParams extends UserHandlerParams {
  listId: ListId;
}

export abstract class UserToListBase extends UserBase {
  protected userToListTable: UserToList;
  protected listId: ListId;

  protected get items() {
    return this.userToListTable.list.items;
  }

  private get numItemsOnList(): number {
    if (!this.items) {
      return 0;
    }
    return this.items.length;
  }

  protected constructor({ listId, ...args }: UserToListConstParams) {
    super(args);

    this.listId = listId;
  }

  protected assertItemLimitOnList(numberOfItems = 1): void {
    if (numberOfItems + this.numItemsOnList >= maxItemLimitOnList) {
      throw fieldError.tooManyItemsOnList;
    }
  }

  protected async getUserToListTable(
    relations: string[]
  ): Promise<UserToList | undefined> {
    return await UserToList.findOne({
      where: this.listId
        ? { listId: this.listId, userId: this.userId }
        : { userId: this.userId },
      relations
    });
  }

  protected validateUserToListTable(
    privilegeLevel: UserPrivileges,
    verifyItemsExist: boolean
  ): void {
    if (verifyItemsExist) {
      if (!this.items || this.items.length < 1) {
        throw fieldError.noItemsOnThatList;
      }
    }

    if (!this.isListOwner) {
      this.assertPrivilegeLevel(privilegeLevel);
    }
  }

  private assertPrivilegeLevel(privilegeLevel: UserPrivileges) {
    switch (privilegeLevel) {
      case 'add':
        this.assertAddPrivilege();
        break;

      case 'strike':
        this.assertStrikePrivilege();
        break;

      case 'delete':
        this.assertDeletePrivilege();
        break;

      case 'owner':
        this.assertOwnerPrivilege();
        break;
    }
  }

  private assertAddPrivilege() {
    if (this.privileges === 'read') {
      throw fieldError.insufficientPrivileges('add');
    }
  }

  private assertStrikePrivilege() {
    if (this.privileges === 'read' || this.privileges === 'add') {
      throw fieldError.insufficientPrivileges('strike');
    }
  }

  private assertDeletePrivilege() {
    if (!this.isListOwner && this.privileges !== 'delete') {
      throw fieldError.insufficientPrivileges('delete');
    }
  }

  private assertOwnerPrivilege() {
    if (!this.isListOwner) {
      throw fieldError.insufficientPrivileges('owner');
    }
  }

  protected validateUniqueItemOnList(itemName: ItemName): void {
    const itemExists = this.items?.find(({ name }) => name === itemName);
    if (itemExists) {
      throw fieldError.itemAlreadyExists;
    }
  }
}
