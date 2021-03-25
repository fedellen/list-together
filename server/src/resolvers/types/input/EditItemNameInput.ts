import { Field, InputType } from 'type-graphql';
@InputType()
export class EditItemNameInput {
  @Field()
  listId: string;

  @Field()
  itemName: string;

  @Field()
  newItemName: string;
}
