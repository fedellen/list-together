import { Field, InputType } from 'type-graphql';

@InputType()
export class RemovalOrderInput {
  @Field(() => [String])
  removedItemArray: string[];

  @Field()
  listId: string;
}
