import { ArgsType, Field, ID } from 'type-graphql';

@ArgsType()
export class SubscriptionArgs {
  @Field(() => [ID])
  listIdArray: string[];
}
