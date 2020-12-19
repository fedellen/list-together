import { IsUUID } from 'class-validator';
import { Field, InputType } from 'type-graphql';

enum styles {
  bold = 'bold',
  strike = 'strike'
}

@InputType()
export class StyleItemInput {
  @IsUUID(4)
  @Field()
  listId: string;

  @Field()
  itemName: string;

  @Field()
  style: styles;

  @Field()
  isStyled: boolean;
}
