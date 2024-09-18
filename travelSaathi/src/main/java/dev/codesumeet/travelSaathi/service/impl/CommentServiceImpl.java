package dev.codesumeet.travelSaathi.service.impl;

import dev.codesumeet.travelSaathi.dto.CommentDTO;
import dev.codesumeet.travelSaathi.entity.Comment;
import dev.codesumeet.travelSaathi.entity.Post;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.repository.CommentRepository;
import dev.codesumeet.travelSaathi.repository.PostRepository;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import dev.codesumeet.travelSaathi.service.CommentService;
import dev.codesumeet.travelSaathi.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService; // Inject NotificationService

    @Override
    public CommentDTO addComment(UUID postId, UUID userId, String commentText) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setComment(commentText);

        Comment savedComment = commentRepository.save(comment);

        // Create a notification for the post owner
        notificationService.createCommentNotification(postId, userId);

        return mapToDTO(savedComment);
    }

    @Override
    public List<CommentDTO> getCommentsForPost(UUID postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public void deleteComment(UUID commentId) {
        commentRepository.deleteById(commentId);
    }

    private CommentDTO mapToDTO(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setId(UUID.fromString(comment.getId().toString()));
        commentDTO.setPostId(UUID.fromString(comment.getPost().getId().toString()));
        commentDTO.setUserId(comment.getUser().getId().toString());
        commentDTO.setUsername(comment.getUser().getUsername());
        commentDTO.setFullName(comment.getUser().getFullName());
        commentDTO.setProfilePicture(comment.getUser().getProfilePicture());
        commentDTO.setComment(comment.getComment());
        commentDTO.setCreatedAt(comment.getCreatedAt());
        commentDTO.setUpdatedAt(comment.getUpdatedAt());

        return commentDTO;
    }
}
