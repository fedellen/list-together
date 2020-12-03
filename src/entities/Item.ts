import { Field } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne
} from 'typeorm';
import { List } from './List';

export class Note {
  text!: string;
}

@Entity('items')
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column('text')
  name!: string;

  @Field(() => [Note])
  @Column({ type: 'simple-array', nullable: true })
  notes: Note[] | null;

  @Field()
  @Column({ type: 'boolean', default: false })
  strike!: boolean;

  @Field()
  @Column({ type: 'boolean', default: false })
  bold!: boolean;

  @Field()
  @Column('smallint')
  order!: number;

  @ManyToOne(() => List, (list) => list.items)
  list: List;
}
