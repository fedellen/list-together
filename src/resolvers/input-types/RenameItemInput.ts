import { IsUUID, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class RenameItemInput {
  @Length(1, 40) // 40 characters
  @Field()
  newName: string;

  @IsUUID(4)
  @Field()
  listId: string;

  @Field()
  itemName: string;
}
