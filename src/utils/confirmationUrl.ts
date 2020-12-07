import { confirmUserPrefix } from '../constants';
import { v4 } from 'uuid';
import { redis } from '../redis';

export const createConfirmationUrl = async (userId: string) => {
  const token = v4();
  await redis.set(confirmUserPrefix + token, userId, 'ex', 60 * 60 * 24); // 1 day expiration

  return `http://localhost:3000/user/confirm/${token}`;
};
