import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { router as authRouter } from './routes/auth';
import { router as apiRouter } from './routes/api';
import { runMigrations } from './db';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: false }));
app.use(express.json({ limit: '1mb' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })
);

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/api', apiRouter);

const port = Number(process.env.PORT || 3000);

runMigrations()
  .then(() => {
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
  })
  .catch((err) => {
    console.error('Migration failed', err);
    process.exit(1);
  });


