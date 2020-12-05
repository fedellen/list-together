import { Field, Int, ObjectType } from 'type-graphql';
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

  @ManyToOne(() => UserToList, (userToList) => userToList.itemHistory)
  userToList!: UserToList;

  @Field(() => String)
  @Column('text')
  item!: string;

  // number of times added to list for smarter auto-completion
  @Field(() => Int)
  @Column({ type: 'integer', default: 1 })
  timesAdded!: number;

  // Ranked Scale of 0-1000 based on each 'shopping trip'
  @Field(() => [Number], { nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  removalOrder: number[] | null;
}
