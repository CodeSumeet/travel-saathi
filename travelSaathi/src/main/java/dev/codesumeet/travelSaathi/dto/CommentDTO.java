package dev.codesumeet.travelSaathi.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CommentDTO {
    private UUID id;
    private UUID postId;
    private String comment;
    private String userId;
    private String username;
    private String fullName;
    private String profilePicture;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
