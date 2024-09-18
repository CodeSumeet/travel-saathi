package dev.codesumeet.travelSaathi.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TripDTO {
    private String id;
    private String destination;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int maxTravelers;
    private LocalDateTime createdAt;

    // User details of the trip creator
    private String userId;
    private String username;
    private String fullName;
    private String creatorImage; // Add this field for user's image URL
}
