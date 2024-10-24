package dev.codesumeet.travelSaathi.controller;

import dev.codesumeet.travelSaathi.dto.ConversationDTO;
import dev.codesumeet.travelSaathi.entity.Conversation;
import dev.codesumeet.travelSaathi.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping("/start")
    public ResponseEntity<Conversation> startConversation(
            @RequestParam UUID userId1,
            @RequestParam UUID userId2
    ) {
        Conversation conversation = conversationService.createConversation(userId1, userId2);
        return ResponseEntity.ok(conversation);
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<Conversation> getConversation(
            @PathVariable UUID conversationId
    ) {
        Optional<Conversation> conversation = conversationService.getConversationById(conversationId);
        return conversation.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ConversationDTO>> getUserConversations(@PathVariable UUID userId) {
        List<ConversationDTO> conversations = conversationService.getConversationsByUser(userId);
        return ResponseEntity.ok(conversations);
    }
}
