import { Field, InputType } from 'type-graphql';

@InputType()
export class DeleteNoteInput {
  @Field(() => String)
  note: string;

  @Field(() => String)
  itemName: string;

  @Field()
  listId: string;
}
