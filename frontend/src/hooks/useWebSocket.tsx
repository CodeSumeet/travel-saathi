import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

interface WebSocketMessage {
  messageType: string;
  payload: any;
}

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const newSocket = new WebSocket(`${url}?userId=${user.id}`);

    newSocket.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket Connected");
    };

    newSocket.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket Disconnected");
    };

    newSocket.onmessage = (event) => {
      console.log("event working: ", event);

      const message = JSON.parse(event.data);
      setLastMessage(message);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [url, user]);

  const sendMessage = useCallback(
    (message: WebSocketMessage) => {
      if (socket && isConnected) {
        socket.send(JSON.stringify(message));
      }
    },
    [socket, isConnected]
  );

  return { isConnected, lastMessage, sendMessage };
};

export { useWebSocket };
