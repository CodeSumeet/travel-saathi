package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    @Query("SELECT c FROM Conversation c WHERE :userId1 MEMBER OF c.userIds AND :userId2 MEMBER OF c.userIds")
    Optional<Conversation> findByUserIdsContaining(@Param("userId1") UUID userId1, @Param("userId2") UUID userId2);

    List<Conversation> findByUserIdsContaining(UUID userId);
}
