import 'dotenv-safe/config';
import 'reflect-metadata';
import { testConn } from './testConn';
import { Connection } from 'typeorm';

// Use --runInBand to avoid closing connection during tests

let connection: Connection | undefined;
beforeAll(async () => {
  connection = await testConn();
});

afterAll(async () => {
  if (connection?.isConnected) {
    await connection.close();
  }
});
