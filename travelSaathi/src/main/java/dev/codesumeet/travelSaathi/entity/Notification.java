package dev.codesumeet.travelSaathi.entity;

import dev.codesumeet.travelSaathi.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "app_notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID actorId; // Who triggered the notification (e.g., liker, commenter)
    private UUID recipientId; // Who receives the notification
    private UUID postId; // Related post ID, if applicable
    private String message; // Custom message
    private String profilePicture; // Field for profile picture

    @Enumerated(EnumType.STRING)
    private NotificationType type; // LIKE, COMMENT, etc.

    private Boolean isRead;
    private LocalDateTime createdAt;

    // Method to return createdAt as an ISO 8601 string
    public String getCreatedAtAsString() {
        return createdAt.format(DateTimeFormatter.ISO_DATE_TIME);
    }
}
