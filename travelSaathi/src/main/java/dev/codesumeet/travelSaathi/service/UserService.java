package dev.codesumeet.travelSaathi.service;

import dev.codesumeet.travelSaathi.dto.ProfileDTO;
import dev.codesumeet.travelSaathi.dto.UserDTO;
import dev.codesumeet.travelSaathi.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

public interface UserService {
    Optional<User> getUserById(UUID userId);
    UserDTO updateUser(String id, UserDTO userDTO, MultipartFile profilePicture) throws IOException;

    // Fetch a profile for a specific user by ID
    ProfileDTO getUserProfile(UUID userId);

    // Fetch profile for the currently logged-in user
    ProfileDTO getLoggedInUserProfile();
}
