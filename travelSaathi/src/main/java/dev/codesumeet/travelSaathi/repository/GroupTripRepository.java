package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.GroupTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GroupTripRepository extends JpaRepository<GroupTrip, UUID> {
}