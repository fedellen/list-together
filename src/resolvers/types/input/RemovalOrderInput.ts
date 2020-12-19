import { IsUUID } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class RemovalOrderInput {
  @Field(() => [String])
  removedItemArray: string[];

  @IsUUID(4)
  @Field()
  listId: string;
}
