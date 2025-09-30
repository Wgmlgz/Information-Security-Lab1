import { Router, Request, Response } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../db';

export const router = Router();

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(8).max(128).required(),
});

router.post('/login', async (req: Request, res: Response) => {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });
    return;
  }
  const { username, password } = value;

  try {
    const userRes = await pool.query(
      'SELECT id, username, password_hash FROM users WHERE username = $1',
      [username]
    );
    if (userRes.rowCount === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const user = userRes.rows[0] as { id: number; username: string; password_hash: string };
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET || 'dev-secret-change-me', {
      expiresIn: '1h',
      algorithm: 'HS256',
    });
    res.status(200).json({ token });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
});


