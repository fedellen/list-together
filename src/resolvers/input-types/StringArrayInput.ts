import { Field, InputType } from 'type-graphql';

@InputType()
export class StringArrayInput {
  @Field(() => [String])
  sortedListsArray: string[];
}