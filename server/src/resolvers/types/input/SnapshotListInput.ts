import { Field, InputType } from 'type-graphql';

@InputType()
export class SnapshotItemInput {
  @Field()
  name: string;

  @Field(() => [String], { nullable: true })
  notes: string[] | null;

  @Field({ defaultValue: false })
  strike: boolean;
}

@InputType()
export class SnapshotListInput {
  @Field()
  listId: string;

  @Field(() => [SnapshotItemInput])
  items: SnapshotItemInput[];
}
