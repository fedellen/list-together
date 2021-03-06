import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne
} from 'typeorm';
import { List } from './List';

@ObjectType()
@Entity('items')
export class Item extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column('text')
  name!: string;

  @Field(() => [String], { nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  notes: string[] | null;

  @Field()
  @Column({ type: 'boolean', default: false })
  strike!: boolean;

  @ManyToOne(() => List, (list) => list.items, { onDelete: 'CASCADE' })
  list: List;
}
