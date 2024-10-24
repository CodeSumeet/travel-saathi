package dev.codesumeet.travelSaathi.dto;

import dev.codesumeet.travelSaathi.enums.NotificationType;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class NotificationDTO {
    private UUID id;
    private UUID actorId;
    private UUID recipientId;
    private UUID postId;
    private String message;
    private NotificationType type;
    private Boolean isRead;
    private String createdAt; // Ensure this is a String to receive the formatted date
    private String profilePicture; // Add profile picture to DTO
}
