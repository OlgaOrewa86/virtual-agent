import express from 'express';
import routing from '../routing/routing.json' with { type: 'json' };

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(routing);
});

export default router;
