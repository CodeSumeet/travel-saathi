package dev.codesumeet.travelSaathi.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDTO {
    String fullName;
    String username;
    String phoneNumber;
    String email;
    String password;
}

