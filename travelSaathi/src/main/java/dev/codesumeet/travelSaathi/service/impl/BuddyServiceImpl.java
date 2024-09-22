package dev.codesumeet.travelSaathi.service.impl;

import dev.codesumeet.travelSaathi.dto.BuddyUserDTO;
import dev.codesumeet.travelSaathi.entity.Buddy;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.repository.BuddyRepository;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import dev.codesumeet.travelSaathi.service.BuddyService;
import lombok.RequiredArgsConstructor;
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
        validateUsersExist(senderId, recipientId);

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

    @Override
    public BuddyUserDTO getUserDTO(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return BuddyUserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .profilePicture(user.getProfilePicture())
                .build();
    }

    private void validateUsersExist(UUID... userIds) {
        for (UUID userId : userIds) {
            userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        }
    }
}
