import { Field, InputType } from 'type-graphql';
// import { PasswordInput } from "../../shared/PasswordInput";

@InputType()
export class StyleItemsInput {
  @Field()
  listId: string;

  @Field(() => [Object])
  itemIdStyle: { itemId: string; style: string }[];
}
