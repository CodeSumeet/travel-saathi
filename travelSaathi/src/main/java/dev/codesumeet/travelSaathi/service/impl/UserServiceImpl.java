package dev.codesumeet.travelSaathi.service.impl;

import dev.codesumeet.travelSaathi.dto.ProfileDTO;
import dev.codesumeet.travelSaathi.dto.UserDTO;
import dev.codesumeet.travelSaathi.entity.Post;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.enums.Gender;
import dev.codesumeet.travelSaathi.exception.UserNotFoundException;
import dev.codesumeet.travelSaathi.mapper.UserMapper;
import dev.codesumeet.travelSaathi.repository.PostRepository;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import dev.codesumeet.travelSaathi.service.CloudinaryService;
import dev.codesumeet.travelSaathi.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final CloudinaryService cloudinaryService;
    private final PostRepository postRepository;

    @Override
    public Optional<User> getUserById(UUID userId) {
        return userRepository.findById(userId);
    }

    @Override
    public UserDTO updateUser(String id, UserDTO userDTO, MultipartFile profilePicture) throws IOException {
        Optional<User> optionalUser = userRepository.findById(UUID.fromString(id));
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Update the user fields from the DTO
            user.setFullName(userDTO.getFullName());
            user.setUsername(userDTO.getUsername());
            user.setContactNumber(userDTO.getContactNumber());
            user.setEmail(userDTO.getEmail());
            user.setCity(userDTO.getCity());
            user.setState(userDTO.getState());
            user.setCountry(userDTO.getCountry());
            user.setGender(Gender.valueOf(userDTO.getGender().toUpperCase()));
            user.setAbout(userDTO.getAbout());

            log.info("Before upload: {}", profilePicture);
            if (profilePicture != null && !profilePicture.isEmpty()) {
                String profilePictureUrl = cloudinaryService.uploadFile(profilePicture, "profile-pictures");
                user.setProfilePicture(profilePictureUrl);
            }
            log.info("After upload: {}", profilePicture);

            User updatedUser = userRepository.save(user);
            return userMapper.convertToDTO(updatedUser);
        } else {
            throw new UserNotFoundException("User not found with id: " + id);
        }
    }

    @Override
    public ProfileDTO getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        List<Post> posts = postRepository.findByUser(user);

        // Calculate the number of buddies
        int buddiesCount = user.getBuddiesAsUser1().size() + user.getBuddiesAsUser2().size();

        // Map user and posts to ProfileDTO
        ProfileDTO profileDTO = userMapper.mapUserToProfileDTO(user, posts);
        profileDTO.setBuddiesCount(buddiesCount);

        return profileDTO;
    }

    @Override
    public ProfileDTO getLoggedInUserProfile() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));

        List<Post> posts = postRepository.findByUser(user);

        int buddiesCount = user.getBuddiesAsUser1().size() + user.getBuddiesAsUser2().size();

        ProfileDTO profileDTO = userMapper.mapUserToProfileDTO(user, posts);
        profileDTO.setBuddiesCount(buddiesCount);

        return profileDTO;
    }

}
