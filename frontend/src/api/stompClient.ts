import { Client } from "@stomp/stompjs";

const connectStomp = () => {
  // Create a STOMP client instance
  const client = new Client({
    brokerURL: "ws://localhost:8080/ws", // WebSocket URL (replace with your server's URL)

    // Set up connection success handling
    onConnect: (frame) => {
      console.log("Connected:", frame);

      // Subscribe to a topic (notifications in this case)
      client.subscribe("/topic/notifications", (message) => {
        console.log("Received message:", message.body);
        // Process the received message
      });
    },

    // Set up connection error handling
    onStompError: (frame) => {
      console.error("Broker reported error:", frame.headers["message"]);
      console.error("Additional details:", frame.body);
    },

    // Optional debug
    debug: (str) => {
      console.log("STOMP Debug:", str);
    },
  });

  // Connect the STOMP client
  client.activate();

  // Disconnect the client if necessary
  return () => {
    client.deactivate();
  };
};

export default connectStomp;
