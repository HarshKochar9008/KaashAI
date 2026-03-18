import Redis from 'ioredis';
import WebSocket from 'ws';

export const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

redis.on('error', (err) => {
  console.error('Redis Client Error', err);
});

let wss: WebSocket.Server;

export const setWebSocketServer = (server: WebSocket.Server) => {
  wss = server;
};

export const broadcastWebSocketMessage = (message: any) => {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
};
