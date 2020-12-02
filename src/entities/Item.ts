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

  @Column({ type: 'simple-array', nullable: true })
  notes: string[];

  @Column({ type: 'boolean', default: false })
  strike: boolean;

  @Column({ type: 'boolean', default: false })
  bold: boolean;

  @Column('smallint')
  order: number;

  @ManyToOne(() => List, (list) => list.items)
  list: List;
}
