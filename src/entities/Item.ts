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

@Entity('items')
export class Item extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column()
  strike: boolean;

  @Column()
  bold: boolean;

  @Column()
  order: number;

  @ManyToOne(() => List, (list) => list.items)
  list: List;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
