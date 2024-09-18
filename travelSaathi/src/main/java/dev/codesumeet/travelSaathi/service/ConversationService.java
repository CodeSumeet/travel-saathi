package dev.codesumeet.travelSaathi.service;

import dev.codesumeet.travelSaathi.entity.Conversation;
import dev.codesumeet.travelSaathi.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConversationService {
    Conversation createConversation(UUID user1, UUID user2);
    Optional<Conversation> getConversationById(UUID conversationId);
    List<Conversation> getConversationsByUser(UUID userId);
}
