import { Field, Int, ObjectType, Root, ID } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne
} from 'typeorm';
import { UserToList } from '.';

@ObjectType()
@Entity('item_history')
export class ItemHistory extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserToList, (userToList) => userToList.itemHistory, {
    onDelete: 'CASCADE'
  })
  userToList!: UserToList;

  @Field(() => String)
  @Column('text')
  item!: string;

  @Column({ type: 'integer', default: 1 })
  timesAdded!: number; // Times added for smarter auto-completion

  @Field(() => Int, { nullable: true })
  removalRating(@Root() parent: ItemHistory): number {
    const removalRatingArray = parent.removalRatingArray;
    // If item has no removalRatings -- send 500, which is `center` of list
    if (!removalRatingArray) return 500;

    // Postgres will not save number array, convert to number array for calculation/graphql
    const removalRatingNumberArray = removalRatingArray.map((a) => parseInt(a));

    const removalRating =
      removalRatingNumberArray.reduce((a, b) => a + b) /
      removalRatingArray.length;
    return Math.round(removalRating);
  }

  // Ranked Scale of 0-1000 based on each 'shopping trip'
  @Column({ type: 'simple-array', nullable: true })
  removalRatingArray: string[] | null;
}
