package dev.codesumeet.travelSaathi.service.impl;

import dev.codesumeet.travelSaathi.dto.ChatMessageDTO;
import dev.codesumeet.travelSaathi.dto.ConversationDTO;
import dev.codesumeet.travelSaathi.dto.UserProfileDTO;
import dev.codesumeet.travelSaathi.entity.ChatMessage;
import dev.codesumeet.travelSaathi.entity.Conversation;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.repository.ConversationRepository;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import dev.codesumeet.travelSaathi.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    @Override
    public Conversation createConversation(UUID userId1, UUID userId2) {
        Set<UUID> userIds = new HashSet<>(Set.of(userId1, userId2));
        Optional<Conversation> existingConversation = conversationRepository.findByUserIdsContaining(userId1, userId2);

        if (existingConversation.isPresent()) {
            return existingConversation.get();
        } else {
            Conversation newConversation = new Conversation();
            newConversation.setUserIds(userIds);
            return conversationRepository.save(newConversation);
        }
    }

    @Override
    public Optional<Conversation> getConversationById(UUID conversationId) {
        return conversationRepository.findById(conversationId);
    }

    @Override
    public List<ConversationDTO> getConversationsByUser(UUID userId) {
        List<Conversation> conversations = conversationRepository.findByUserIdsContaining(userId);

        return conversations.stream()
                .map(conversation -> {
                    ConversationDTO dto = new ConversationDTO();
                    dto.setId(conversation.getId());

                    // Convert userIds to UserProfileDTO for each participant
                    List<UserProfileDTO> participants = convertUserIdsToProfiles(conversation.getUserIds());
                    dto.setUsers(participants);

                    // Optionally, set the last message of the conversation (if needed)
                    conversation.getMessages().stream()
                            .max(Comparator.comparing(ChatMessage::getTimestamp))  // Get the most recent message by timestamp
                            .ifPresent(lastMessage -> dto.setLastMessage(convertToDTO(lastMessage)));  // Convert to DTO

                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Convert user IDs to UserProfileDTO
    public List<UserProfileDTO> convertUserIdsToProfiles(Set<UUID> userIds) {
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

    private ChatMessageDTO convertToDTO(ChatMessage chatMessage) {
        return new ChatMessageDTO(
                chatMessage.getId(),
                chatMessage.getSender().getId(),
                chatMessage.getConversation().getId(),
                chatMessage.getMessage(),
                chatMessage.getTimestamp()
        );
    }

}
