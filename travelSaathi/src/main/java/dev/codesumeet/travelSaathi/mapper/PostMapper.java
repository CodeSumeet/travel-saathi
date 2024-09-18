package dev.codesumeet.travelSaathi.mapper;

import dev.codesumeet.travelSaathi.dto.PostDTO;
import dev.codesumeet.travelSaathi.entity.Post;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    public PostDTO convertToDTO(Post post) {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId().toString());
        postDTO.setLocation(post.getLocation());
        postDTO.setDescription(post.getDescription());
        postDTO.setImageUrl(post.getImageUrl());
        postDTO.setLikesCount(post.getLikesCount());
        postDTO.setCreatedAt(post.getCreatedAt());
        postDTO.setUpdatedAt(post.getUpdatedAt());

        // Adding user details to PostDTO
        postDTO.setUserId(post.getUser().getId().toString());
        postDTO.setUsername(post.getUser().getUsername());
        postDTO.setFullName(post.getUser().getFullName());
        postDTO.setProfilePicture(post.getUser().getProfilePicture());

        return postDTO;
    }
}
