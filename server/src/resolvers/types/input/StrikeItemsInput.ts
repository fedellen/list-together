import { Field, InputType } from 'type-graphql';
@InputType()
export class StrikeItemsInput {
  @Field()
  listId: string;

  @Field(() => [String])
  itemNameArray: string[];
}
