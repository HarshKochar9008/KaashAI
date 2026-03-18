import { useEffect, useState, useRef } from 'react';

export function useWebSocket(url: string) {
  const [messages, setMessages] = useState<any>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectInterval = useRef<any>(null);

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(url);
      
      ws.current.onopen = () => {
        console.log('WS Connected');
        if (reconnectInterval.current) {
          clearInterval(reconnectInterval.current);
          reconnectInterval.current = null;
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages(data);
        } catch (e) {
          console.error(e);
        }
      };

      ws.current.onclose = () => {
        console.log('WS Disconnected, retrying...');
        if (!reconnectInterval.current) {
          reconnectInterval.current = setInterval(() => {
            connect();
          }, 3000);
        }
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
      }
    };
  }, [url]);

  return [messages];
}
