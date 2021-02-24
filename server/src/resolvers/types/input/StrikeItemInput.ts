import { Field, InputType } from 'type-graphql';
@InputType()
export class StrikeItemInput {
  @Field()
  listId: string;

  @Field()
  itemName: string;
}
