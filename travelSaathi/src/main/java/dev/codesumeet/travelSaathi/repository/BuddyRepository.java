package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.Buddy;
import dev.codesumeet.travelSaathi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BuddyRepository extends JpaRepository<Buddy, UUID> {
    List<Buddy> findByUserId1AndAccepted(User user, boolean accepted);
    List<Buddy> findByUserId2AndAccepted(User buddy, boolean accepted);
    Buddy findByUserId1AndUserId2(User userId1, User userId2);
    List<Buddy> findByUserId1OrUserId2AndAccepted(UUID userId, UUID buddyId, boolean accepted);
}
