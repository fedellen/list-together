import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  BeforeInsert
} from 'typeorm';
import { Item } from './Item';
import { UserToList } from './UserToList';
import { v4 } from 'uuid';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity('lists')
export class List extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column('text')
  title!: string;

  @Field(() => [Item], { nullable: true })
  @OneToMany(() => Item, (item) => item.list, {
    cascade: true,
    nullable: true
  })
  items: Item[] | null;

  @OneToMany(() => UserToList, (userToList) => userToList.list)
  userConnection!: UserToList[];

  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}
