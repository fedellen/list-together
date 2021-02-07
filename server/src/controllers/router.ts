import express from 'express';
import { confirmUserPrefix, FRONT_END_URL } from '../constants';
import { User } from '../entities';
import { redis } from '../redis';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const token = req.params.id;

  const userId = await redis.get(confirmUserPrefix + token);

  if (!userId) {
    res.sendStatus(404);
  } else {
    await User.update({ id: userId }, { confirmed: true });
    await redis.del(confirmUserPrefix + token);
    res.redirect(FRONT_END_URL);
  }
});

export default router;
