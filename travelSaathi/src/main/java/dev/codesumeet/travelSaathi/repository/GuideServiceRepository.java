package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.GuideService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GuideServiceRepository extends JpaRepository<GuideService, UUID> {
}