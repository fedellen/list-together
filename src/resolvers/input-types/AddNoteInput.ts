import { IsUUID, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class AddNoteInput {
  @Field()
  @IsUUID(4)
  listId: string;

  @Field()
  itemName: string;

  @Field()
  @Length(1, 40)
  note: string;
}
