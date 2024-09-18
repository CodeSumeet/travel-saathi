package dev.codesumeet.travelSaathi.dto;

import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class ConversationDTO {
    private UUID id;
    private Set<UUID> userIds;
    private ChatMessageDTO lastMessage;
}