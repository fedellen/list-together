import { Field, InputType } from 'type-graphql';

@InputType()
export class PreferredOrderInput {
  @Field(() => [String])
  removedItemArray: string[];

  @Field()
  listId: string;
}
