package dev.codesumeet.travelSaathi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.codesumeet.travelSaathi.dto.ProfileDTO;
import dev.codesumeet.travelSaathi.dto.UserDTO;
import dev.codesumeet.travelSaathi.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable String id,
            @RequestPart("user") String userDTOJson,  // Capture the JSON string
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) throws IOException {

        // Convert JSON string to UserDTO object
        ObjectMapper objectMapper = new ObjectMapper();
        UserDTO userDTO = objectMapper.readValue(userDTOJson, UserDTO.class);

        // Call the service to update the user
        log.info("Controller: {}", userDTO);
        UserDTO updatedUser = userService.updateUser(id, userDTO, profilePicture);

        // Return the response
        return ResponseEntity.ok(Map.of("user", updatedUser));
    }

    // Get the profile for a specific user (publicly visible)
    @GetMapping("/{userId}/profile")
    public ResponseEntity<ProfileDTO> getUserProfile(@PathVariable UUID userId) {
        ProfileDTO profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    // Get the profile for the currently logged-in user
    @GetMapping("/me/profile")
    public ResponseEntity<ProfileDTO> getMyProfile() {
        ProfileDTO profile = userService.getLoggedInUserProfile();
        return ResponseEntity.ok(profile);
    }

}
