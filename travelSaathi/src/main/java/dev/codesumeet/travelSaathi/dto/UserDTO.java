package dev.codesumeet.travelSaathi.dto;

import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.entity.Role;
import dev.codesumeet.travelSaathi.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    // Additional constructor for id and username
    public UserDTO(UUID id, String username) {
        this.id = id.toString();
        this.username = username;
    }

    public UserDTO(User user) {
        this.id = user.getId().toString();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.dob = user.getDob() != null ? user.getDob().toLocalDate() : null;
        this.gender = user.getGender() != null ? user.getGender().toString() : null;
        this.city = user.getCity();
        this.state = user.getState();
        this.country = user.getCountry();
        this.about = user.getAbout();
        this.profilePicture = user.getProfilePicture();
        this.contactNumber = user.getContactNumber();
        this.roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }

    private String id;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password should have at least 6 characters")
    private String password;

    private String fullName;
    private LocalDate dob;
    private String gender;
    private String city;
    private String state;
    private String country;
    private String about;
    private String profilePicture;

    // Phone number is optional
    private String contactNumber;

    // Field for roles
    private Set<UserRole> roles;
}