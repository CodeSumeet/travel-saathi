export const connectSse = (
  userId: string,
  onMessage: (event: MessageEvent) => void
) => {
  const sse = new EventSource(`/api/notifications/sse/${userId}`);

  sse.onmessage = onMessage;
  sse.onerror = (error) => {
    console.error("Error with SSE connection:", error);
    sse.close();
  };

  return sse; // Return the connection so it can be closed when needed
};
