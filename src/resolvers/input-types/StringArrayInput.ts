import { Field, InputType } from 'type-graphql';

// Generic string array for sorted lists/items
@InputType()
export class StringArrayInput {
  @Field(() => [String])
  stringArray: string[];
}
