package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.AuthToken;
import dev.codesumeet.travelSaathi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuthTokenRepository extends JpaRepository<AuthToken, UUID> {
    AuthToken findByToken(String token);
    AuthToken findByUser(User user);
}