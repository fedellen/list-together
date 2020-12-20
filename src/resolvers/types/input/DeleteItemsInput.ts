import { Field, InputType } from 'type-graphql';

@InputType()
export class DeleteItemsInput {
  @Field(() => [String])
  itemNameArray: string[];

  // @IsUUID(4)
  @Field()
  listId: string;
}
