package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findBySenderIdOrRecipientId(UUID senderId, UUID recipientId);
    List<ChatMessage> findByConversationIdOrderByTimestampAsc(UUID conversationId);
}
