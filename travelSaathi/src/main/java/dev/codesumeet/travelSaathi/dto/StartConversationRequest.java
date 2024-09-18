package dev.codesumeet.travelSaathi.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class StartConversationRequest {
    private UUID userId1;
    private UUID userId2;
}
