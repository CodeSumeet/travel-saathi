package dev.codesumeet.travelSaathi.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProfileDTO {
    private String userId;
    private String username;
    private String fullName;
    private String profilePicture;
    private String about;
    private String city;
    private String state;
    private String country;
    private List<PostDTO> posts;  // Assuming you want to show the user's posts on their profile
}
