package dev.codesumeet.travelSaathi.service;

import dev.codesumeet.travelSaathi.dto.ChatMessageDTO;
import dev.codesumeet.travelSaathi.entity.ChatMessage;

import java.util.List;
import java.util.UUID;

public interface ChatMessageService {
//    void saveChatMessage(ChatMessageDTO chatMessageDTO);
//    List<ConversationDTO> getUserConversations(UUID userId);
//    boolean areUsersBuddies(UUID userId1, UUID userId2);
//    void createConversation(UUID userId1, UUID userId2);
    ChatMessage sendMessage(ChatMessageDTO messageDTO);
    List<ChatMessage> getConversationMessages(UUID conversationId);
}
