// import { IsUUID } from 'class-validator';
import { Field, InputType } from 'type-graphql';

enum styles {
  bold = 'bold',
  strike = 'strike'
}

@InputType()
export class StyleItemInput {
  @Field()
  listId: string;

  @Field()
  itemName: string;

  @Field()
  style: styles;
}
