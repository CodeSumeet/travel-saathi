package dev.codesumeet.travelSaathi.controller;

import dev.codesumeet.travelSaathi.dto.BuddyRequestDTO;
import dev.codesumeet.travelSaathi.dto.BuddyResponseDTO;
import dev.codesumeet.travelSaathi.dto.BuddyUserDTO;
import dev.codesumeet.travelSaathi.entity.Buddy;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.service.BuddyService;
import dev.codesumeet.travelSaathi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buddies")
@RequiredArgsConstructor
public class BuddyController {

    private final BuddyService buddyService;
    private final UserService userService;

    @PostMapping("/request")
    public ResponseEntity<BuddyResponseDTO> sendBuddyRequest(@RequestBody BuddyRequestDTO request, @RequestParam UUID userId) {
        Buddy buddy = buddyService.sendBuddyRequest(userId, request.getRecipientId());
        return ResponseEntity.ok(convertToDTO(buddy));
    }

    @PostMapping("/{buddyRequestId}/accept")
    public ResponseEntity<BuddyResponseDTO> acceptBuddyRequest(@PathVariable UUID buddyRequestId) {
        Buddy buddy = buddyService.acceptBuddyRequest(buddyRequestId);
        return ResponseEntity.ok(convertToDTO(buddy));
    }

    @GetMapping("/list")
    public ResponseEntity<List<BuddyResponseDTO>> getUserBuddies(@RequestParam UUID userId) {
        List<Buddy> buddies = buddyService.getUserBuddies(userId);
        List<BuddyResponseDTO> buddyDTOs = buddies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(buddyDTOs);
    }

    private BuddyResponseDTO convertToDTO(Buddy buddy) {
        BuddyResponseDTO dto = new BuddyResponseDTO();

        Optional<User> user1 = userService.getUserById(buddy.getUserId1());
        Optional<User> user2 = userService.getUserById(buddy.getUserId2());

        dto.setId(buddy.getId());
        dto.setUser1(convertToUserDTO(user1.get()));
        dto.setUser2(convertToUserDTO(user2.get()));
        dto.setAccepted(buddy.isAccepted());
        dto.setCreatedAt(buddy.getCreatedAt());
        return dto;
    }

    private BuddyUserDTO convertToUserDTO(User user) {
        BuddyUserDTO dto = new BuddyUserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setUsername(user.getUsername());
        dto.setProfilePicture(user.getProfilePicture());
        return dto;
    }
}
