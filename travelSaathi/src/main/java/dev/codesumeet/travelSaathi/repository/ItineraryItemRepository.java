package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.ItineraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ItineraryItemRepository extends JpaRepository<ItineraryItem, UUID> {
}