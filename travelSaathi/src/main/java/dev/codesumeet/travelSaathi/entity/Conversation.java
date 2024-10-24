package dev.codesumeet.travelSaathi.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "conversation_users", joinColumns = @JoinColumn(name = "conversation_id"))
    @Column(name = "user_id")
    private Set<UUID> userIds;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "last_message_id")
    private ChatMessage lastMessage; // Add this line to hold the last message
}
