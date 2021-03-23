import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BaseEntity,
  OneToMany
} from 'typeorm';
import { v4 } from 'uuid';
import { UserToList } from './UserToList';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'text', unique: true })
  email: string;

  @Field(() => [String], { nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  sortedListsArray: string[] | null;

  @OneToMany(() => UserToList, (userToList) => userToList.user)
  listConnection: UserToList[];

  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}
