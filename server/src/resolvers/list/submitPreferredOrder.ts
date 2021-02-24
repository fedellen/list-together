import { UserToList, ItemHistory } from '../../entities';
import { logger } from '../../middleware/logger';
import { MyContext } from '../../MyContext';
import { UseMiddleware, Mutation, Arg, Ctx, Resolver } from 'type-graphql';
import { PreferredOrderInput } from '../types/input/PreferredOrderInput';
import { UserToListResponse } from '../types/response/UserToListResponse';
import { validateContext } from '../types/validators/validateContext';
import { validateUserToList } from '../types/validators/validateUserToList';

Resolver();
export class SubmitPreferredOrderResolver {
  // Submit preferred order of items for Smart-Sort feature
  // User sends sorted array of item names as their preferred order
  @UseMiddleware(logger)
  @Mutation(() => UserToListResponse)
  async submitPreferredOrder(
    @Arg('data') { removedItemArray, listId }: PreferredOrderInput,
    @Ctx() context: MyContext
  ): Promise<UserToListResponse> {
    const contextError = validateContext(context);
    if (contextError) return { errors: contextError };

    const userId = context.req.session.userId;
    const userToListTable = await UserToList.findOne({
      where: { listId: listId, userId: userId },
      relations: ['itemHistory']
    });

    const userListErrors = validateUserToList({
      userToList: userToListTable
    });
    if (userListErrors) return { errors: userListErrors };
    else if (!userToListTable)
      throw new Error('UserList validation error on `submitPreferredOrder`..');

    const arrayLengthRating = Math.round(1000 / removedItemArray.length);

    removedItemArray.forEach((item) => {
      const newRemovalRating = Math.round(
        (removedItemArray.indexOf(item) + 0.5) * arrayLengthRating
      ).toString(); // Save number as a string in Postgres

      /**
       *  Add 10 ratings to array to override and previous ratings
       *  This will also allow for the preferred order to `decay`
       */
      let arrayWithTenRemovalRatings: string[] = [];
      for (let i = 0; i < 10; i++) {
        arrayWithTenRemovalRatings = [
          ...arrayWithTenRemovalRatings,
          newRemovalRating
        ];
      }

      if (!userToListTable.itemHistory) {
        // Initialize item history
        userToListTable.itemHistory = [
          ItemHistory.create({
            item: item,
            removalRatingArray: arrayWithTenRemovalRatings
          })
        ];
      } else {
        const itemInHistory = userToListTable.itemHistory.find(
          (i) => i.item === item
        );
        if (!itemInHistory) {
          // Add item to item history
          userToListTable.itemHistory = [
            ...userToListTable.itemHistory,
            ItemHistory.create({
              item: item,
              removalRatingArray: arrayWithTenRemovalRatings
            })
          ];
        } else {
          // Replace removalRating array with preferred rating
          itemInHistory.removalRatingArray = arrayWithTenRemovalRatings;
        }
      }
    });
    await userToListTable.save();
    return { userToList: [userToListTable] };
  }
}
