import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BaseEntity,
  OneToMany
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserToList } from './UserToList';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  password: string;

  @Column({ type: 'text', unique: true })
  email: string;

  // still need to add OAuth

  @OneToMany(() => UserToList, (userToList) => userToList.user)
  listConnection?: UserToList[];

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
