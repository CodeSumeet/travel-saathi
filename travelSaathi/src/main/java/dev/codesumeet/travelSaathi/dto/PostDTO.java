package dev.codesumeet.travelSaathi.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDTO {
    private String id;
    private String location;
    private String description;
    private String imageUrl;
    private Integer likesCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // New fields for user info
    private String userId;
    private String username;
    private String fullName;
    private String profilePicture;

    // Indicates if the post is liked by the current user
    private boolean likedByUser;

    private List<CommentDTO> comments;
}
