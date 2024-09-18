package dev.codesumeet.travelSaathi.entity;

import dev.codesumeet.travelSaathi.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
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

    @Enumerated(EnumType.STRING)
    private NotificationType type; // LIKE, COMMENT, etc.

    private Boolean isRead;
    private LocalDateTime createdAt;

    // Additional fields if necessary (e.g., tripId for trip-related notifications)
}
