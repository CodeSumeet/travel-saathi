package dev.codesumeet.travelSaathi.controller;

import dev.codesumeet.travelSaathi.dto.ChatMessageDTO;
import dev.codesumeet.travelSaathi.dto.ConversationDTO;
import dev.codesumeet.travelSaathi.entity.ChatMessage;
import dev.codesumeet.travelSaathi.entity.Conversation;
import dev.codesumeet.travelSaathi.service.ChatMessageService;
import dev.codesumeet.travelSaathi.service.ConversationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageService chatService;
    private final ConversationService conversationService;

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

//    @GetMapping("/conversations/user/{userId}")
//    public ResponseEntity<List<ConversationDTO>> getUserConversations(@PathVariable UUID userId) {
//        List<Conversation> conversations = conversationService.getConversationsByUser(userId);
//        return ResponseEntity.ok(conversations.stream().map(this::convertToDTO).collect(Collectors.toList()));
//    }

    private ChatMessageDTO convertToDTO(ChatMessage chatMessage) {
        return new ChatMessageDTO(
                chatMessage.getId(),
                chatMessage.getSender().getId(),
                chatMessage.getRecipient().getId(),
                chatMessage.getMessage(),
                chatMessage.getTimestamp()
        );
    }

    private ConversationDTO convertToDTO(Conversation conversation) {
        ConversationDTO dto = new ConversationDTO();
        dto.setId(conversation.getId());
//        dto.setUsers(conversation.getUserIds());
        conversation.getMessages().stream()
                .max((m1, m2) -> m1.getTimestamp().compareTo(m2.getTimestamp()))
                .ifPresent(lastMessage -> dto.setLastMessage(convertToDTO(lastMessage)));
        return dto;
    }
}
