package dev.codesumeet.travelSaathi.controller;

import dev.codesumeet.travelSaathi.dto.LoginDTO;
import dev.codesumeet.travelSaathi.dto.UserDTO;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.exception.UserAlreadyExistsException;
import dev.codesumeet.travelSaathi.mapper.UserMapper;
import dev.codesumeet.travelSaathi.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@Valid @RequestBody UserDTO userDTO) {
        log.info("Registering user: {}", userDTO.getFullName());
        log.info("Registering user: {}", userDTO.getUsername());
        log.info("Registering user: {}", userDTO.getPassword());

        try {
            UserDTO createdUser = authService.registerUser(userDTO);
            Map<String, String> tokens = authService.loginUser(userDTO.getUsername(), userDTO.getPassword());
            return ResponseEntity.ok(Map.of(
                    "user", createdUser,
                    "accessToken", tokens.get("accessToken"),
                    "refreshToken", tokens.get("refreshToken")
            ));
        } catch (UserAlreadyExistsException e) {
            log.error("User registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error registering user: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Error registering user"));
        }
    }



    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@Valid @RequestBody LoginDTO loginDto) {
        log.info("Logging in User: {}", loginDto.getUsername());
        try {
            Map<String, String> tokens = authService.loginUser(loginDto.getUsername(), loginDto.getPassword());
            User user = authService.getUserByUsername(loginDto.getUsername());
            return ResponseEntity.ok(Map.of("user", userMapper.convertToDTO(user), "accessToken", tokens.get("accessToken"), "refreshToken", tokens.get("refreshToken")));
        } catch (Exception e) {
            log.error("Error during login: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestHeader("Authorization") String authorizationHeader) {
        log.info("Refreshing token");
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            String newAccessToken = authService.refreshAccessToken(token);
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        } catch (Exception e) {
            log.error("Error refreshing token: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired token"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logoutUser(@RequestHeader("Authorization") String authorizationHeader) {
        log.info("Logging out user");
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            authService.logoutUser(token);
            return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
        } catch (Exception e) {
            log.error("Error during logout: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Error during logout"));
        }
    }
}