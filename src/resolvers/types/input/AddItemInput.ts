import { IsUUID, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class AddItemInput {
  @Field()
  @IsUUID(4)
  listId: string;

  @Field()
  @Length(1, 40)
  nameInput: string;
}
