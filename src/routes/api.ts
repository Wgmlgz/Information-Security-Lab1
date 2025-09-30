import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { pool } from '../db';
import { requireAuth } from '../middleware/auth';

export const router = Router();

// Protected: list posts
router.get('/data', requireAuth, async (_req: Request, res: Response) => {
  const result = await pool.query('SELECT id, title, body, created_at FROM posts ORDER BY id DESC');
  // XSS mitigation: ensure data is safe by treating as plain JSON, not HTML
  res.status(200).json({ items: result.rows });
});

// Third endpoint: create a post (protected)
const createPostSchema = Joi.object({
  title: Joi.string().max(120).required(),
  body: Joi.string().max(5000).required(),
});

router.post('/posts', requireAuth, async (req: Request, res: Response) => {
  const { error, value } = createPostSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    res.status(400).json({ message: 'Validation failed', details: error.details.map(d => d.message) });
    return;
  }
  const { title, body } = value;

  // Parameterized query protects against SQLi
  const inserted = await pool.query(
    'INSERT INTO posts (title, body, created_by) VALUES ($1, $2, $3) RETURNING id, title, body, created_at',
    [title, body, req.auth?.userId || null]
  );
  res.status(201).json(inserted.rows[0]);
});


