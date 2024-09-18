package dev.codesumeet.travelSaathi.controller;

import dev.codesumeet.travelSaathi.entity.Conversation;
import dev.codesumeet.travelSaathi.service.ConversationService;
import dev.codesumeet.travelSaathi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final UserService userService;

    @PostMapping("/start")
    public ResponseEntity<Conversation> startConversation(
            @RequestParam UUID userId1,
            @RequestParam UUID userId2
    ) {
        // Create or fetch conversation
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
    public ResponseEntity<List<Conversation>> getUserConversations(@PathVariable UUID userId) {
        List<Conversation> conversations = conversationService.getConversationsByUser(userId);
        return ResponseEntity.ok(conversations);
    }
}
