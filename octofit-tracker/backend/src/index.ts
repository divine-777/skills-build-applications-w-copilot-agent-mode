import './server';

import dotenv from 'dotenv';
import express from 'express';
import { connectDatabase } from './config/database';

dotenv.config();

const app = express();
const PORT = 8000;

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'OctoFit Tracker backend is running',
    baseUrl,
    port: PORT,
    mongodb: 'mongodb://localhost:27017/octofit_db'
  });
});

async function startServer(): Promise<void> {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`OctoFit backend listening on ${baseUrl}`);
  });
}

void startServer();
