import { Item } from '../../../entities';
import { ObjectType, Field } from 'type-graphql';
import { FieldError } from './FieldError';

@ObjectType()
export class ItemResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Item, { nullable: true })
  item?: Item;
}
