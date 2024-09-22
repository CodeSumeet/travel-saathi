package dev.codesumeet.travelSaathi.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class BuddyUserDTO {
    private UUID id;
    private String fullName;
    private String username;
    private String profilePicture;
}
