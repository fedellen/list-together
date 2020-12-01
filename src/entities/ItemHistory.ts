import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BaseEntity,
  ManyToOne
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { List } from './List';

@Entity('itemHistory')
export class ItemHistory extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  item: string;

  // number of times added to list for smarter auto-completion
  @Column()
  timesAdded: number;

  // Ranked Scale of 0-1000 based on each 'shopping trip'
  @Column('simple-array')
  removalOrder: number[];

  @ManyToOne(() => List, (list) => list.itemHistory)
  list: List;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
