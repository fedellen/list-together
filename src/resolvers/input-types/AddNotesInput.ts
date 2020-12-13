import { Field, InputType } from 'type-graphql';
// import { PasswordInput } from "../../shared/PasswordInput";

@InputType()
export class AddNotesInput {
  @Field()
  listId: string;

  @Field(() => [Object])
  itemIdNote: { itemId: string; note: string }[];
}
