import 'reflect-metadata';
import { Connection } from 'typeorm';
import { testConn } from '../helpers/testConn';
import { redis } from '../../redis';

let conn: Connection;
// beforeAll(async () => {
//   // Create connections before all
//   conn = await testConn();
//   if (redis.status === 'end') await redis.connect();
// });

beforeEach(async () => {
  // // Clear DB before each test
  // conn.entityMetadatas.forEach(async (entity) => {
  //   const repository = conn.getRepository(entity.name);
  //   await repository.query(`DELETE FROM ${entity.tableName}`);
  // });
  conn = await testConn();
  if (redis.status === 'end') await redis.connect();
});

afterEach(async () => {
  // Close connections
  await conn.close();
  redis.disconnect();
});
