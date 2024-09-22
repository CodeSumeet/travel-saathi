package dev.codesumeet.travelSaathi.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class BuddyResponseDTO {
    private UUID id;
    private BuddyUserDTO user1;
    private BuddyUserDTO user2;
    private boolean accepted;
    private LocalDateTime createdAt;
}
