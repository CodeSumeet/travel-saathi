package dev.codesumeet.travelSaathi.service.impl;

import dev.codesumeet.travelSaathi.entity.Buddy;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.repository.BuddyRepository;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import dev.codesumeet.travelSaathi.service.BuddyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BuddyServiceImpl implements BuddyService {

    private final BuddyRepository buddyRepository;
    private final UserRepository userRepository;

    @Override
    public Buddy sendBuddyRequest(UUID senderId, UUID recipientId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        Buddy buddy = new Buddy();
        buddy.setUserId1(senderId);
        buddy.setUserId2(recipientId);
        buddy.setAccepted(false);
        buddy.setCreatedAt(LocalDateTime.now());

        return buddyRepository.save(buddy);
    }

    @Override
    public Buddy acceptBuddyRequest(UUID buddyRequestId) {
        Buddy buddy = buddyRepository.findById(buddyRequestId)
                .orElseThrow(() -> new RuntimeException("Buddy request not found"));
        buddy.setAccepted(true);
        return buddyRepository.save(buddy);
    }

    @Override
    public List<Buddy> getUserBuddies(UUID userId) {
        return buddyRepository.findByUserId1OrUserId2AndAccepted(userId, userId, true);
    }
}
