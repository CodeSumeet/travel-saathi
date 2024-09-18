package dev.codesumeet.travelSaathi.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.codesumeet.travelSaathi.dto.ChatMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final Map<UUID, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String query = session.getUri().getQuery();
        String userIdParam = query != null && query.contains("userId=") ? query.split("userId=")[1] : null;

        try {
            if (userIdParam != null) {
                UUID userId = UUID.fromString(userIdParam);
                userSessions.put(userId, session);
                System.out.println("Connection established for user: " + userId + ", Session ID: " + session.getId());
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

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming text messages related to chat
        // You can add logic here if you need to process chat messages
    }

    public void sendChatMessage(UUID recipientId, ChatMessageDTO chatMessageDTO) {
        try {
            WebSocketSession session = userSessions.get(recipientId);
            if (session != null && session.isOpen()) {
                String message = objectMapper.writeValueAsString(chatMessageDTO);
                session.sendMessage(new TextMessage(message));
            } else {
                System.err.println("No open session for recipient: " + recipientId);
            }
        } catch (IOException e) {
            System.err.println("Error sending chat message: " + e.getMessage());
        }
    }
}
