import { Item, List, ItemHistory } from '../entities';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';

@Resolver()
export class ItemResolver {
  // Add item to list
  @Mutation(() => Item)
  async addItem(
    @Arg('name') nameInput: string,
    // Front end will determine the orderInput before sending request
    @Arg('order') orderInput: number,
    @Arg('listId') listId: string
  ): Promise<Item> {
    // find the list
    const list = await getRepository(List).findOne({
      where: { id: listId },
      relations: ['items', 'itemHistory']
    });
    if (!list) throw new Error('Invalid list id..');

    const newItem = Item.create({ name: nameInput, order: orderInput });

    if (list.items) {
      // Handle itemExists condition on the front end, this will provide extra security
      const itemExists = list.items.find(({ name }) => name === nameInput);
      if (itemExists) throw new Error('Item already exists on this list..');

      list.items = [...list.items, newItem];
    } else {
      list.items = [newItem];
    }

    const newItemInHistory = ItemHistory.create({ item: nameInput });

    if (list.itemHistory) {
      const existingItemInHistory = list.itemHistory.find(
        ({ item }) => item === nameInput
      );

      if (existingItemInHistory) {
        existingItemInHistory.timesAdded = existingItemInHistory.timesAdded + 1;
      } else {
        list.itemHistory = [...list.itemHistory, newItemInHistory];
      }
    } else {
      list.itemHistory = [newItemInHistory];
    }

    await list.save();
    console.log(list);
    return newItem;
  }

  // Delete item from list
}
