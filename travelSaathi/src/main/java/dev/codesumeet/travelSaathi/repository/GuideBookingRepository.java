package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.GuideBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GuideBookingRepository extends JpaRepository<GuideBooking, UUID> {
}