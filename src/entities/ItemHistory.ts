import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne
} from 'typeorm';
import { List } from './List';

@ObjectType()
@Entity('item_history')
export class ItemHistory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column('text')
  item!: string;

  // number of times added to list for smarter auto-completion
  @Field()
  @Column({ type: 'integer', default: 1 })
  timesAdded!: number;

  // Ranked Scale of 0-1000 based on each 'shopping trip'
  @Field(() => [Number])
  @Column({ type: 'simple-array', nullable: true })
  removalOrder: number[] | null;

  @ManyToOne(() => List, (list) => list.itemHistory)
  list: List;
}
