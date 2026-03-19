import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import assignmentsRouter from './routes/assignments';
import authRouter from './routes/auth';
import { setWebSocketServer } from './config/redis';
import IORedis from 'ioredis';

dotenv.config();

async function start() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Prevent long "buffering timed out" waits when Mongo is down
  mongoose.set('bufferCommands', false);

  const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vedaai';

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error('MONGO_URI:', MONGODB_URI);
    process.exit(1);
  }

  app.use('/api/auth', authRouter);
  app.use('/api/assignments', assignmentsRouter);

  const server = http.createServer(app);

  // WebSocket Server for progress updates
  const wss = new WebSocketServer({ server, path: '/ws' });
  setWebSocketServer(wss);

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket Connected!' }));

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  const sub = process.env.REDIS_URL
    ? new IORedis(process.env.REDIS_URL)
    : new IORedis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      });

  sub.subscribe('ws_broadcast', (err) => {
    if (err) {
      console.error('Failed to subscribe to Redis Channel ws_broadcast', err);
    }
  });

  sub.on('message', (channel, message) => {
    if (channel === 'ws_broadcast') {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(message);
        }
      });
    }
  });

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
