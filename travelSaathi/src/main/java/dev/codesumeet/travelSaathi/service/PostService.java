package dev.codesumeet.travelSaathi.service;

import dev.codesumeet.travelSaathi.dto.PostDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface PostService {
    PostDTO createPost(UUID userId, String location, String description, MultipartFile image) throws IOException;
    List<PostDTO> getAllPosts(UUID userId); // This returns all posts along with user info
    int likePost(UUID postId, UUID userId);
    int unlikePost(UUID postId, UUID userId);
}
