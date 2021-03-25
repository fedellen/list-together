import { Field, InputType } from 'type-graphql';
@InputType()
export class EditNoteInput {
  @Field()
  listId: string;

  @Field()
  itemName: string;

  @Field()
  note: string;

  @Field()
  newNote: string;
}
