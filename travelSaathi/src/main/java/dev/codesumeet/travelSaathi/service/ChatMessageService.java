package dev.codesumeet.travelSaathi.service;

import dev.codesumeet.travelSaathi.dto.ChatMessageDTO;
import dev.codesumeet.travelSaathi.entity.ChatMessage;

import java.util.List;
import java.util.UUID;

public interface ChatMessageService {
    ChatMessage sendMessage(ChatMessageDTO messageDTO);
    List<ChatMessage> getConversationMessages(UUID conversationId);
}
