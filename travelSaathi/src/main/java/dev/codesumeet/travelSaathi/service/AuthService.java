package dev.codesumeet.travelSaathi.service;

import dev.codesumeet.travelSaathi.dto.UserDTO;
import dev.codesumeet.travelSaathi.entity.User;

import java.util.Map;

public interface AuthService {
    UserDTO registerUser(UserDTO userDTO);
    Map<String, String> loginUser(String username, String password);
    String refreshAccessToken(String refreshToken);
    User getUserByUsername(String username);
    void logoutUser(String accessToken);
}