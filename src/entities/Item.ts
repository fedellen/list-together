import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne
} from 'typeorm';
import { List } from './List';

@Entity('items')
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('boolean')
  strike: boolean;

  @Column('boolean')
  bold: boolean;

  @Column('smallint')
  order: number;

  @ManyToOne(() => List, (list) => list.items)
  list: List;
}
