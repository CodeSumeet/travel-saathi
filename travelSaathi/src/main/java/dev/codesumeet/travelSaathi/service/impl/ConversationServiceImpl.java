package dev.codesumeet.travelSaathi.service.impl;

import dev.codesumeet.travelSaathi.entity.Conversation;
import dev.codesumeet.travelSaathi.repository.ConversationRepository;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import dev.codesumeet.travelSaathi.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

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
    public List<Conversation> getConversationsByUser(UUID userId) {
        return conversationRepository.findByUserIdsContaining(userId);
    }
}
