package dev.codesumeet.travelSaathi.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.codesumeet.travelSaathi.dto.NotificationDTO;
import dev.codesumeet.travelSaathi.dto.ChatMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Configuration
@Component
@RequiredArgsConstructor
public class NotificationAndChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<UUID, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String query = session.getUri().getQuery();
        String userIdParam = query != null && query.contains("userId=") ? query.split("userId=")[1] : null;

        try {
            if (userIdParam != null) {
                UUID userId = UUID.fromString(userIdParam);
                userSessions.put(userId, session);
                System.out.println("Connection established for user: " + userId + ", Session ID: " + session.getId() + " URI: " + session.getUri());
                userSessions.forEach((id, sess) -> System.out.println("User ID: " + id + ", Session ID: " + sess.getId()));
            } else {
                System.err.println("Invalid userId parameter");
                session.close(CloseStatus.POLICY_VIOLATION);
            }
        } catch (IllegalArgumentException | IOException e) {
            System.err.println("Invalid UUID format: " + userIdParam);
            try {
                session.close(CloseStatus.POLICY_VIOLATION);
            } catch (IOException ioException) {
                ioException.printStackTrace();
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        userSessions.entrySet().removeIf(entry -> entry.getValue().equals(session));
        System.out.println("Connection closed: " + session.getId() + " Status: " + status);
    }

//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        String payload = message.getPayload();
//
//        // Parse the payload to determine the message type
//        MessageType messageType = getMessageType(payload);
//        UUID senderId = null;
//        UUID recipientId = null;
//        String textMessage = null;
//        long timestamp = System.currentTimeMillis(); // Assuming current timestamp
//
//        if (messageType != MessageType.PING) {
//            senderId = getSenderId(payload);
//            recipientId = getRecipientId(payload);
//            textMessage = getTextMessage(payload);
//        }
//
//        switch (messageType) {
//            case BUDDY_REQUEST:
//                Buddy buddy = buddyService.sendBuddyRequest(senderId, recipientId);
//                // Notify the recipient (implement a notification mechanism)
////                sendNotification(recipientId, new NotificationDTO(/* construct the appropriate DTO */));
//                break;
//            case CHAT_MESSAGE:
//                log.info("CHAT_MESSAGE");
//                // Create ChatMessageDTO instance using the default constructor and setters
//                ChatMessageDTO chatMessageDTO = new ChatMessageDTO();
//                chatMessageDTO.setId(UUID.randomUUID());
//                chatMessageDTO.setSenderId(senderId);
//                chatMessageDTO.setRecipientId(recipientId);
//                chatMessageDTO.setMessage(textMessage);
//                chatMessageDTO.setTimestamp(LocalDateTime.now());
//
//                // Send the chat message
////                chatService.sendMessage(chatMessageDTO);
////                sendChatMessage(recipientId, chatMessageDTO);
//                break;
//            case PING:
//                System.out.println("Received ping from user: " + session.getId());
//                break;
//            default:
//                System.err.println("Unknown message type received");
//        }
//    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        System.err.println("Transport error: " + exception.getMessage());
    }

    public void printSess() {
        System.out.println("Print sess");
        userSessions.forEach((id, sess) -> System.out.println("User ID: " + id + ", Session ID: " + sess.getId()));
    }

    public void sendNotification(UUID userId, NotificationDTO notificationDTO) {
        try {
            System.out.println("Attempting to send notification to user: " + userId);

            // Log the state of userSessions before sending notification
            System.out.println("Available sessions before sending notification: ");
            userSessions.forEach((id, sess) -> System.out.println("User ID: " + id + ", Session ID: " + sess.getId()));

            WebSocketSession session = userSessions.get(userId);
            if (session != null && session.isOpen()) {
                System.out.println("Sending notification to user: " + userId + ", Session ID: " + session.getId());
                sendMessage(session, notificationDTO);
            } else {
                System.err.println("No session found for user: " + userId);
                System.out.println("Available sessions when notification failed: ");
                userSessions.forEach((id, sess) -> System.out.println("User ID: " + id + ", Session ID: " + sess.getId()));
            }
            printSess();
        } catch (Exception e) {
            System.out.println("Exception in sendNotification: " + e);
            throw new RuntimeException(e);
        }
    }



    public void sendChatMessage(UUID recipientId, ChatMessageDTO chatMessageDTO) throws IOException {
        WebSocketSession recipientSession = userSessions.get(recipientId);
        if (recipientSession != null && recipientSession.isOpen()) {
            log.info("Session ID: {}", recipientSession.getId());
            String message = objectMapper.writeValueAsString(chatMessageDTO);
            log.info("ChatMessageDTO id: {}", chatMessageDTO.getId());
//            recipientSession.sendMessage(new TextMessage(message));
            sendMessage(recipientSession, chatMessageDTO);
        } else {
            System.err.println("No open session for recipient: " + recipientId);
        }
    }

    private void sendMessage(WebSocketSession session, Object messageDTO) throws IOException {
        try {
            String message = objectMapper.writeValueAsString(messageDTO);
            System.out.println("Sending message to client: " + message);
            session.sendMessage(new TextMessage(message));
        } catch (JsonProcessingException e) {
            System.err.println("Error converting message to JSON: " + e.getMessage());
        }
    }

    private MessageType getMessageType(String payload) {
        try {
            Map<String, Object> messageData = objectMapper.readValue(payload, Map.class);
            String messageTypeString = (String) messageData.get("messageType");
            return MessageType.valueOf(messageTypeString);
        } catch (Exception e) {
            System.err.println("Error parsing message type: " + e.getMessage());
            return null; // Return null or handle unknown message type appropriately
        }
    }


    private UUID getSenderId(String payload) {
        try {
            Map<String, Object> messageData = objectMapper.readValue(payload, Map.class);
            String senderIdString = (String) messageData.get("senderId");
            return UUID.fromString(senderIdString);
        } catch (Exception e) {
            System.err.println("Error extracting senderId from payload: " + e.getMessage());
            return null; // Handle the case where senderId is not present or invalid
        }
    }

    private UUID getRecipientId(String payload) {
        try {
            Map<String, Object> messageData = objectMapper.readValue(payload, Map.class);
            String recipientIdString = (String) messageData.get("recipientId");
            return UUID.fromString(recipientIdString);
        } catch (Exception e) {
            System.err.println("Error extracting recipientId from payload: " + e.getMessage());
            return null; // Handle the case where recipientId is not present or invalid
        }
    }

    private String getTextMessage(String payload) {
        try {
            Map<String, Object> messageData = objectMapper.readValue(payload, Map.class);
            return (String) messageData.get("message");
        } catch (Exception e) {
            System.err.println("Error extracting message from payload: " + e.getMessage());
            return ""; // Handle the case where message is not present
        }
    }


    private enum MessageType {
        BUDDY_REQUEST,
        CHAT_MESSAGE,
        PING
    }
}


//this is the line

//
//@Override
//public void handleTextMessage(WebSocketSession session, TextMessage message) {
//    try {
//        System.out.println("handle");
//        System.out.println("f" + userSessions.get(UUID.fromString("1fc87ea0-2f1b-47a8-8249-22de837f015f")));
//        userSessions.forEach((id, sess) -> System.out.println("User ID: " + id + ", Session ID: " + sess.getId()));
//        String payload = message.getPayload();
//        System.out.println("payload: " + payload);
//        System.out.println("Received message: " + payload);
//
//        // Assuming payload contains some user-related info
//        if (payload.contains("test")) {
//            System.out.println("Received test message");
//            NotificationDTO testNotification = new NotificationDTO();
//            testNotification.setId(UUID.randomUUID());
//            testNotification.setType(NotificationType.TEST);
//            testNotification.setMessage("This is a test notification from the server");
//            testNotification.setIsRead(false);
//            testNotification.setActorId(UUID.randomUUID()); // Set a dummy actor ID
//            testNotification.setRecipientId(UUID.fromString(session.getId())); // Ensure this is correct
//            testNotification.setPostId(UUID.randomUUID()); // Set a dummy post ID if applicable
//
//            System.out.println("Sending test notification: " + testNotification);
//            sendMessage(session, testNotification);
//        }
//    } catch (IOException e) {
//        System.err.println("Error processing message: " + e.getMessage());
//    }
//}