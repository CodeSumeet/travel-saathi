package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TripRepository extends JpaRepository<Trip, UUID> {

    // Find trips by destination (case-insensitive)
    List<Trip> findByDestinationIgnoreCase(String destination);
}
