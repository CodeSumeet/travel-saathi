package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.ConnectionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, UUID> {
    boolean existsByTripIdAndInterestedUserId(UUID tripId, UUID interestedUserId);
}