package dev.codesumeet.travelSaathi.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ConversationDTO {
    private UUID id;
    private List<UserProfileDTO> users;
    private ChatMessageDTO lastMessage;
}

