import { useEffect, useState, useRef, useCallback } from 'react';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export function useWebSocket(url: string) {
  const [messages, setMessages] = useState<unknown>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const ws = useRef<WebSocket | null>(null);
  const reconnectInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const connect = useCallback(() => {
    setConnectionStatus('connecting');
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setConnectionStatus('connected');
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
        reconnectInterval.current = null;
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const data: unknown = JSON.parse(event.data);
        setMessages(data);
      } catch (e) {
        console.error('WS parse error:', e);
      }
    };

    ws.current.onclose = () => {
      setConnectionStatus('reconnecting');
      if (!reconnectInterval.current) {
        reconnectInterval.current = setInterval(() => {
          connect();
        }, 3000);
      }
    };

    ws.current.onerror = () => {
      setConnectionStatus('disconnected');
    };
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
      }
    };
  }, [connect]);

  return [messages, connectionStatus] as const;
}
