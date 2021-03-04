import { Field, InputType } from 'type-graphql';

@InputType()
export class AddItemInput {
  @Field()
  listId: string;

  @Field(() => [String])
  nameInput: string[];
}
