package dev.codesumeet.travelSaathi.controller;

import dev.codesumeet.travelSaathi.dto.PostDTO;
import dev.codesumeet.travelSaathi.exception.ResourceNotFoundException;
import dev.codesumeet.travelSaathi.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Slf4j
public class PostController {

    private final PostService postService;

    // Fetch all posts along with user details
    @GetMapping("/all-posts")
    public ResponseEntity<List<PostDTO>> getAllPosts(@RequestParam("userId") UUID userId) {
        List<PostDTO> posts = postService.getAllPosts(userId);  // Pass userId to service
        return ResponseEntity.ok(posts);
    }

    // Endpoint for creating a new post
    @PostMapping("/create-post")
    public ResponseEntity<Map<String, Object>> createPost(
            @RequestParam("userId") UUID userId,
            @RequestParam("location") String location,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image) throws IOException {

        PostDTO postDTO = postService.createPost(userId, location, description, image);
        return ResponseEntity.ok(Map.of("post", postDTO));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Map<String, Object>> likePost(@PathVariable UUID postId, @RequestParam UUID userId) {
        try {
            int newLikeCount = postService.likePost(postId, userId);
            return ResponseEntity.ok(Map.of("likeCount", newLikeCount));
        } catch (ResourceNotFoundException e) {
            log.error("Resource not found while liking post: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while liking post: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Database constraint violation"));
        } catch (Exception e) {
            log.error("Unexpected error while liking post: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred"));
        }
    }

    @PostMapping("/{postId}/unlike")
    public ResponseEntity<Map<String, Object>> unlikePost(@PathVariable UUID postId, @RequestParam UUID userId) {
        try {
            int newLikeCount = postService.unlikePost(postId, userId);
            return ResponseEntity.ok(Map.of("likeCount", newLikeCount));
        } catch (Exception e) {
            log.error("Error unliking post: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
