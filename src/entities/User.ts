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
  id!: string;

  @Field()
  @Column('text')
  username!: string;

  @Column('text')
  password!: string;

  @Column('bool', { default: false })
  confirmed!: boolean;

  @Field()
  @Column({ type: 'text', unique: true })
  email!: string;

  // still need to add OAuth

  @Field(() => [String], { nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  sortedListsArray: string[] | null;

  // @Field(() => [UserToList])
  @OneToMany(() => UserToList, (userToList) => userToList.user)
  listConnection: UserToList[];

  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}
