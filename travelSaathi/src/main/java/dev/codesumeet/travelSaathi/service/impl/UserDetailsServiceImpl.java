package dev.codesumeet.travelSaathi.service.impl;

import dev.codesumeet.travelSaathi.entity.CustomUserDetails;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByUsername(username);
        User user = userOptional.orElseThrow(() ->
                new UsernameNotFoundException("User not found with username: " + username));
        return new CustomUserDetails(user);
    }
}
