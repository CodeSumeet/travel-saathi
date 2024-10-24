package dev.codesumeet.travelSaathi.service.impl;

import dev.codesumeet.travelSaathi.config.ChatWebSocketHandler;
import dev.codesumeet.travelSaathi.dto.ChatMessageDTO;
import dev.codesumeet.travelSaathi.entity.ChatMessage;
import dev.codesumeet.travelSaathi.entity.Conversation;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.repository.ChatMessageRepository;
import dev.codesumeet.travelSaathi.repository.ConversationRepository;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import dev.codesumeet.travelSaathi.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatMessageService {

    private final ChatWebSocketHandler webSocketHandler;
    private final ChatMessageRepository chatMessageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    @Override
    public ChatMessage sendMessage(ChatMessageDTO chatMessageDTO) {
        User sender = userRepository.findById(chatMessageDTO.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found: " + chatMessageDTO.getSenderId()));
        User recipient = userRepository.findById(chatMessageDTO.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found: " + chatMessageDTO.getRecipientId()));

        Conversation conversation = getOrCreateConversation(chatMessageDTO.getSenderId(), chatMessageDTO.getRecipientId());

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSender(sender);
        chatMessage.setRecipient(recipient);
        chatMessage.setConversation(conversation);
        chatMessage.setMessage(chatMessageDTO.getMessage());
        chatMessage.setTimestamp(LocalDateTime.now());

        chatMessage = chatMessageRepository.save(chatMessage);

        // Update the last message in the conversation
        conversation.setLastMessage(chatMessage);
        conversationRepository.save(conversation); // Save the updated conversation

        ChatMessageDTO savedMessageDTO = convertToDTO(chatMessage);
        webSocketHandler.sendChatMessage(recipient.getId(), savedMessageDTO);

        return chatMessage;
    }

    @Override
    public List<ChatMessage> getConversationMessages(UUID conversationId) {
        return chatMessageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    private Conversation getOrCreateConversation(UUID userId1, UUID userId2) {
        return conversationRepository.findByUserIdsContaining(userId1, userId2)
                .orElseGet(() -> {
                    Conversation newConversation = new Conversation();
                    Set<UUID> userIds = new HashSet<>(Arrays.asList(userId1, userId2));
                    newConversation.setUserIds(userIds);
                    return conversationRepository.save(newConversation);
                });
    }

    @Override
    public Optional<ChatMessage> markMessageAsRead(UUID messageId) {
        Optional<ChatMessage> chatMessageOpt = chatMessageRepository.findById(messageId);
        if (chatMessageOpt.isPresent()) {
            ChatMessage chatMessage = chatMessageOpt.get();
            chatMessage.setRead(true); // Assuming you've added setIsRead in the entity
            chatMessageRepository.save(chatMessage);
            return Optional.of(chatMessage);
        }
        return Optional.empty();
    }

    private ChatMessageDTO convertToDTO(ChatMessage chatMessage) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(chatMessage.getId());
        dto.setSenderId(chatMessage.getSender().getId());
        dto.setRecipientId(chatMessage.getRecipient().getId());
        dto.setMessage(chatMessage.getMessage());
        dto.setTimestamp(chatMessage.getTimestamp());
        return dto;
    }
}
