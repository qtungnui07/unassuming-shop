import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createApp } from './app.js';
import { config } from './config.js';
import { prisma } from './db.js';

const app = createApp();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../dist');

if (config.nodeEnv === 'production') {
  app.use(express.static(root));
  app.get('*', (_request, response) => response.sendFile(path.join(root, 'index.html')));
}

const server = app.listen(config.port, () => {
  console.log(`Unassuming API listening on ${config.port}`);
});

const shutdown = () => server.close(() => void prisma.$disconnect());
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
