import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne
} from 'typeorm';
import { List } from './List';

@Entity('item_history')
export class ItemHistory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  item: string;

  // number of times added to list for smarter auto-completion
  @Column({ type: 'integer', default: 1 })
  timesAdded: number;

  // Ranked Scale of 0-1000 based on each 'shopping trip'
  @Column({ type: 'simple-array', nullable: true })
  removalOrder?: number[];

  @ManyToOne(() => List, (list) => list.itemHistory)
  list: List;
}
