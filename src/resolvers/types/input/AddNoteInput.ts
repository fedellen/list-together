import { Field, InputType } from 'type-graphql';

@InputType()
export class AddNoteInput {
  @Field()
  listId: string;

  @Field()
  itemName: string;

  @Field()
  note: string;
}
