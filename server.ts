import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateHandler, markHandler, chatHandler } from './lib/handlers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));

app.post('/api/assessments/generate', generateHandler);
app.post('/api/assessments/mark', markHandler);
app.post('/api/chat', chatHandler);
app.get('/api/health', (_req, res) =>
  res.json({ ok: true, model: process.env.CLAUDE_MODEL || 'claude-sonnet-5-5', keyConfigured: Boolean(process.env.ANTHROPIC_API_KEY) })
);

async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`DocuAssess AI running on http://localhost:${PORT}`));
}
start();
