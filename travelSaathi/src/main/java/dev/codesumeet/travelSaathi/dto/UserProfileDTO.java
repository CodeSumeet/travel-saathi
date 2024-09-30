package dev.codesumeet.travelSaathi.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class UserProfileDTO {
    private UUID id;
    private String fullName;
    private String username;
    private String profilePicture;
}
