package dev.codesumeet.travelSaathi.service.impl;

import dev.codesumeet.travelSaathi.dto.UserDTO;
import dev.codesumeet.travelSaathi.entity.AuthToken;
import dev.codesumeet.travelSaathi.entity.Role;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.enums.UserRole;
import dev.codesumeet.travelSaathi.exception.UserAlreadyExistsException;
import dev.codesumeet.travelSaathi.exception.UserNotFoundException;
import dev.codesumeet.travelSaathi.exception.InvalidCredentialsException;
import dev.codesumeet.travelSaathi.mapper.UserMapper;
import dev.codesumeet.travelSaathi.repository.AuthTokenRepository;
import dev.codesumeet.travelSaathi.repository.RoleRepository;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import dev.codesumeet.travelSaathi.service.AuthService;
import dev.codesumeet.travelSaathi.utils.JwtUtils;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final AuthTokenRepository authTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public UserDTO registerUser(UserDTO userDTO) {
        log.info("Registering new user with email: {}", userDTO.getEmail());

        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        User user = userMapper.convertToEntity(userDTO);
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));

        // Set default role to ROLE_USER
        Role userRole = roleRepository.findByName(UserRole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Default role not found"));
        user.getRoles().add(userRole);

        user = userRepository.save(user);

        log.info("User registered successfully: {}", user.getUsername());
        return userMapper.convertToDTO(user);
    }

    @Override
    public Map<String, String> loginUser(String username, String password) {
        log.info("Attempting login for user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException("Incorrect password");
        }

        String accessToken = jwtUtils.generateAccessToken(user);
        String refreshToken = jwtUtils.generateRefreshToken(user.getUsername());

        AuthToken authToken = new AuthToken();
        authToken.setUser(user);
        authToken.setToken(refreshToken);
        authToken.setExpiryDate(jwtUtils.getRefreshTokenExpiry());
        authToken.setCreatedAt(LocalDateTime.now());
        authTokenRepository.save(authToken);

        log.info("Login successful for user: {}", username);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }

    @Override
    public String refreshAccessToken(String accessToken) {
        String username;
        try {
            username = jwtUtils.getUsernameFromJwt(accessToken);
        } catch (ExpiredJwtException e) {
            username = e.getClaims().getSubject();
        }

        User user = getUserByUsername(username);
        AuthToken authToken = authTokenRepository.findByUser(user);

        if (authToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            authTokenRepository.delete(authToken);
            throw new InvalidCredentialsException("Refresh token expired");
        }

        return jwtUtils.generateAccessToken(user);
    }

    @Override
    public User getUserByUsername(String username) {
        log.info("Fetching user details for username: {}", username);

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public void logoutUser(String accessToken) {
        log.info("Attempting to logout user");

        String username;
        try {
            username = jwtUtils.getUsernameFromJwt(accessToken);
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token during logout attempt");
            return; // If the token is already expired, no need to invalidate
        }

        User user = getUserByUsername(username);
        AuthToken authToken = authTokenRepository.findByUser(user);

        if (authToken != null) {
            authTokenRepository.delete(authToken);
            log.info("Refresh token deleted for user: {}", username);
        }

        log.info("Logout successful for user: {}", username);
    }

}