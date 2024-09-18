package dev.codesumeet.travelSaathi.service;

import dev.codesumeet.travelSaathi.entity.Buddy;

import java.util.List;
import java.util.UUID;

public interface BuddyService {
    Buddy sendBuddyRequest(UUID senderId, UUID recipientId);
    Buddy acceptBuddyRequest(UUID buddyRequestId);
    List<Buddy> getUserBuddies(UUID userId);
}
