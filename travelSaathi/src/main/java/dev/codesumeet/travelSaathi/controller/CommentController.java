package dev.codesumeet.travelSaathi.controller;

import dev.codesumeet.travelSaathi.dto.CommentDTO;
import dev.codesumeet.travelSaathi.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Slf4j
public class CommentController {

    private final CommentService commentService;

    // Add a comment to a post
    @PostMapping("/{postId}/add-comment")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable UUID postId,
            @RequestParam UUID userId,
            @RequestParam String comment) {
        CommentDTO newComment = commentService.addComment(postId, userId, comment);
        return ResponseEntity.ok(newComment);
    }

    // Get all comments for a specific post
    @GetMapping("/{postId}")
    public ResponseEntity<List<CommentDTO>> getCommentsForPost(@PathVariable UUID postId) {
        List<CommentDTO> comments = commentService.getCommentsForPost(postId);
        return ResponseEntity.ok(comments);
    }

    // Delete a comment by its ID
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable UUID commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
