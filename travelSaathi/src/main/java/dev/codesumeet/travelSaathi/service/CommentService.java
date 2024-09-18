package dev.codesumeet.travelSaathi.service;

import dev.codesumeet.travelSaathi.dto.CommentDTO;
import java.util.List;
import java.util.UUID;

public interface CommentService {
    CommentDTO addComment(UUID postId, UUID userId, String commentText);
    List<CommentDTO> getCommentsForPost(UUID postId);
    void deleteComment(UUID commentId);
}
