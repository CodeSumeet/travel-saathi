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

    @OneToMany(mappedBy = "conversation", fetch = FetchType.EAGER)
    private Set<ChatMessage> messages;
}
