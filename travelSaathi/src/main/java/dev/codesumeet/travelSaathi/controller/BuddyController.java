package dev.codesumeet.travelSaathi.controller;

import dev.codesumeet.travelSaathi.dto.BuddyRequestDTO;
import dev.codesumeet.travelSaathi.dto.BuddyResponseDTO;
import dev.codesumeet.travelSaathi.entity.Buddy;
import dev.codesumeet.travelSaathi.service.BuddyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buddies")
@RequiredArgsConstructor
public class BuddyController {

    private final BuddyService buddyService;

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
        List<BuddyResponseDTO> buddyDTOs = buddyService.getUserBuddies(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(buddyDTOs);
    }

    private BuddyResponseDTO convertToDTO(Buddy buddy) {
        return BuddyResponseDTO.builder()
                .id(buddy.getId())
                .user1(buddyService.getUserDTO(buddy.getUserId1()))
                .user2(buddyService.getUserDTO(buddy.getUserId2()))
                .accepted(buddy.isAccepted())
                .createdAt(buddy.getCreatedAt())
                .build();
    }
}
