import 'reflect-metadata';
import { testConn } from './testConn';
import { Connection } from 'typeorm';

// Use --runInBand to avoid closing connection during tests

let connection: Connection;
beforeAll(async () => {
  connection = await testConn();
});

afterAll(async () => {
  await connection.close();
});
