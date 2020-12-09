// import 'reflect-metadata';
import { Item, ItemHistory, List, User, UserToList } from '../../entities';
import { createConnection } from 'typeorm';

export const testConn = () => {
  return createConnection({
    host: 'localhost',
    type: 'postgres',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'grocery-db-test',
    dropSchema: true,
    synchronize: true,
    entities: [User, List, UserToList, Item, ItemHistory]
    // migrations: ['src/migration/**/*.ts'],
    // subscribers: ['src/subscriber/**/*.ts'],
    // cli: {
    //   entitiesDir: 'src/entity',
    //   migrationsDir: 'src/migration',
    //   subscribersDir: 'src/subscriber'
    // }
  });
};
