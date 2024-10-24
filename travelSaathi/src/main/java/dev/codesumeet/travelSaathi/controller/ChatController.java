package dev.codesumeet.travelSaathi.controller;

import dev.codesumeet.travelSaathi.dto.ChatMessageDTO;
import dev.codesumeet.travelSaathi.dto.ConversationDTO;
import dev.codesumeet.travelSaathi.dto.UserProfileDTO;
import dev.codesumeet.travelSaathi.entity.ChatMessage;
import dev.codesumeet.travelSaathi.entity.Conversation;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import dev.codesumeet.travelSaathi.service.ChatMessageService;
import dev.codesumeet.travelSaathi.service.ConversationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageService chatService;
    private final ConversationService conversationService;
    private final UserRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<ChatMessageDTO> sendMessage(@RequestBody ChatMessageDTO messageDTO) {
        ChatMessage chatMessage = chatService.sendMessage(messageDTO);
        return ResponseEntity.ok(convertToDTO(chatMessage));
    }

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<List<ChatMessageDTO>> getConversationMessages(@PathVariable UUID conversationId) {
        List<ChatMessage> messages = chatService.getConversationMessages(conversationId);
        return ResponseEntity.ok(messages.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @PostMapping("/messages/{messageId}/read")
    public ResponseEntity<ChatMessageDTO> markMessageAsRead(@PathVariable UUID messageId) {
        ChatMessage chatMessage = chatService.markMessageAsRead(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found: " + messageId));
        return ResponseEntity.ok(convertToDTO(chatMessage));
    }

    private ChatMessageDTO convertToDTO(ChatMessage chatMessage) {
        if (chatMessage == null) {
            return null; // or throw new IllegalArgumentException("ChatMessage cannot be null");
        }

        return new ChatMessageDTO(
                chatMessage.getId(),
                chatMessage.getSender().getId(),
                chatMessage.getRecipient() != null ? chatMessage.getRecipient().getId() : null,
                chatMessage.getMessage(),
                chatMessage.isRead(), // Include read status
                chatMessage.getTimestamp()
        );
    }

    private ConversationDTO convertToDTO(Conversation conversation) {
        ConversationDTO dto = new ConversationDTO();
        dto.setId(conversation.getId());
        // Optionally, set the users
        List<UserProfileDTO> participants = convertUserIdsToProfiles(conversation.getUserIds());
        dto.setUsers(participants);
        return dto;
    }

    private List<UserProfileDTO> convertUserIdsToProfiles(Set<UUID> userIds) {
        return userIds.stream()
                .map(userRepository::findById) // Fetch user details from repository
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(this::convertToProfileDTO) // Convert User to UserProfileDTO
                .collect(Collectors.toList());
    }

    // Convert User entity to UserProfileDTO
    private UserProfileDTO convertToProfileDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setUsername(user.getUsername());
        dto.setProfilePicture(user.getProfilePicture());
        return dto;
    }
}
