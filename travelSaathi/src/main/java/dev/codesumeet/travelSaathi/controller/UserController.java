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
            @RequestPart("user") String userDTOJson,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        UserDTO userDTO = objectMapper.readValue(userDTOJson, UserDTO.class);

        log.info("Controller: {}", userDTO);
        UserDTO updatedUser = userService.updateUser(id, userDTO, profilePicture);

        return ResponseEntity.ok(Map.of("user", updatedUser));
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<ProfileDTO> getUserProfile(@PathVariable UUID userId) {
        ProfileDTO profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/me/profile")
    public ResponseEntity<ProfileDTO> getMyProfile() {
        ProfileDTO profile = userService.getLoggedInUserProfile();
        return ResponseEntity.ok(profile);
    }
}
