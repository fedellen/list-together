import { Field, Int, ObjectType, Root } from 'type-graphql';
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
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserToList, (userToList) => userToList.itemHistory, {
    onDelete: 'CASCADE'
  })
  userToList!: UserToList;

  @Field(() => String)
  @Column('text')
  item!: string;

  // number of times added to list for smarter auto-completion
  @Field(() => Int)
  @Column({ type: 'integer', default: 1 })
  timesAdded!: number;

  @Field(() => Int, { nullable: true })
  removalRating(@Root() parent: ItemHistory): number {
    const removalRatingArray = parent.removalRatingArray;
    if (!removalRatingArray) return 500; // 500 is `middle` of list
    return (
      removalRatingArray.reduce((a, b) => a + b) / removalRatingArray.length
    );
  }

  // Ranked Scale of 0-1000 based on each 'shopping trip'
  // @Field(() => [Number], { nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  removalRatingArray: number[] | null;
}
