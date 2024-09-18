package dev.codesumeet.travelSaathi.mapper;

import dev.codesumeet.travelSaathi.dto.PostDTO;
import dev.codesumeet.travelSaathi.dto.ProfileDTO;
import dev.codesumeet.travelSaathi.dto.UserDTO;
import dev.codesumeet.travelSaathi.entity.Post;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.entity.Role;
import dev.codesumeet.travelSaathi.enums.Gender;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserDTO convertToDTO(User user) {
        if (user == null) {
            return null;
        }

        UserDTO dto = new UserDTO();
        dto.setId(user.getId().toString());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setDob(user.getDob() != null ? user.getDob().toLocalDate() : null);
        dto.setGender(user.getGender() != null ? user.getGender().toString() : null);
        dto.setContactNumber(user.getContactNumber());
        dto.setCity(user.getCity());
        dto.setState(user.getState());
        dto.setCountry(user.getCountry());
        dto.setAbout(user.getAbout());
        dto.setProfilePicture(user.getProfilePicture());

        // Convert Set<Role> to Set<UserRole>
        dto.setRoles(user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet()));

        return dto;
    }

    public User convertToEntity(UserDTO dto) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setId(dto.getId() != null ? UUID.fromString(dto.getId()) : null);
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setFullName(dto.getFullName());
        user.setDob(dto.getDob() != null ? dto.getDob().atStartOfDay() : null);
        user.setGender(dto.getGender() != null ? Gender.valueOf(dto.getGender()) : null);
        user.setCity(dto.getCity());
        user.setState(dto.getState());
        user.setCountry(dto.getCountry());
        user.setAbout(dto.getAbout());
        user.setProfilePicture(dto.getProfilePicture());
        user.setContactNumber(dto.getContactNumber());

        // Note: We don't set roles here as they should be managed by the service layer
        // The roles will be set when registering or updating user roles

        return user;
    }

    // Map a User entity to ProfileDTO
    public ProfileDTO mapUserToProfileDTO(User user, List<Post> posts) {
        ProfileDTO profileDTO = new ProfileDTO();
        profileDTO.setUserId(user.getId().toString());
        profileDTO.setUsername(user.getUsername());
        profileDTO.setFullName(user.getFullName());
        profileDTO.setProfilePicture(user.getProfilePicture());
        profileDTO.setPosts(posts.stream().map(this::mapPostToDTO).collect(Collectors.toList()));
        return profileDTO;
    }

    // Map a Post entity to PostDTO
    public PostDTO mapPostToDTO(Post post) {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId().toString());
        postDTO.setLocation(post.getLocation());
        postDTO.setDescription(post.getDescription());
        postDTO.setImageUrl(post.getImageUrl());
        postDTO.setLikesCount(post.getLikesCount());
        postDTO.setCreatedAt(post.getCreatedAt());
        postDTO.setUpdatedAt(post.getUpdatedAt());
        postDTO.setUserId(post.getUser().getId().toString());
        postDTO.setUsername(post.getUser().getUsername());
        postDTO.setFullName(post.getUser().getFullName());
        postDTO.setProfilePicture(post.getUser().getProfilePicture());
        return postDTO;
    }
}