import { Field, InputType } from 'type-graphql';

@InputType()
export class RenameItemInput {
  @Field()
  newName: string;

  @Field()
  listId: string;

  @Field()
  itemName: string;
}
