package dev.codesumeet.travelSaathi.service.impl;

import dev.codesumeet.travelSaathi.dto.PostDTO;
import dev.codesumeet.travelSaathi.entity.PostLike;
import dev.codesumeet.travelSaathi.entity.Post;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.exception.UserNotFoundException;
import dev.codesumeet.travelSaathi.mapper.PostMapper;
import dev.codesumeet.travelSaathi.repository.PostLikeRepository;
import dev.codesumeet.travelSaathi.repository.PostRepository;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import dev.codesumeet.travelSaathi.service.CloudinaryService;
import dev.codesumeet.travelSaathi.service.NotificationService;
import dev.codesumeet.travelSaathi.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final PostMapper postMapper;
    private final PostLikeRepository postLikeRepository;
    private final NotificationService notificationService; // Inject NotificationService

    @Override
    public List<PostDTO> getAllPosts(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();

        return posts.stream()
                .map(post -> {
                    PostDTO postDTO = postMapper.convertToDTO(post);
                    boolean likedByUser = postLikeRepository.findByUserAndPost(user, post).isPresent();
                    postDTO.setLikedByUser(likedByUser);
                    return postDTO;
                })
                .collect(Collectors.toList());
    }

    @Override
    public PostDTO createPost(UUID userId, String location, String description, MultipartFile image) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        String imageUrl = cloudinaryService.uploadFile(image, "post-images");

        Post post = new Post();
        post.setUser(user);
        post.setLocation(location);
        post.setDescription(description);
        post.setImageUrl(imageUrl);

        Post savedPost = postRepository.save(post);

        return postMapper.convertToDTO(savedPost);
    }

    @Override
    @Transactional
    public int likePost(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<PostLike> existingLike = postLikeRepository.findByUserAndPost(user, post);

        if (existingLike.isPresent()) {
            throw new RuntimeException("Post already liked by this user");
        }

        PostLike postLike = new PostLike();
        postLike.setUser(user);
        post.addLike(postLike);

        postLikeRepository.save(postLike);

        // Create a notification for the post owner
        notificationService.createLikeNotification(postId, userId);

        return post.getLikesCount();
    }

    @Override
    @Transactional
    public int unlikePost(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PostLike existingLike = postLikeRepository.findByUserAndPost(user, post)
                .orElseThrow(() -> new RuntimeException("Like not found"));

        post.removeLike(existingLike);

        postLikeRepository.delete(existingLike);

        return post.getLikesCount();
    }
}
