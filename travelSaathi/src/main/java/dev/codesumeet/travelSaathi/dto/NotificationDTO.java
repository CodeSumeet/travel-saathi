package dev.codesumeet.travelSaathi.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.codesumeet.travelSaathi.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDTO {
    private UUID id;
    private UUID actorId;
    private UUID recipientId;
    private UUID postId;
    private String message;
    private NotificationType type;
    private Boolean isRead;

//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
//    private LocalDateTime createdAt;
}
