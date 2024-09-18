package dev.codesumeet.travelSaathi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "buddies", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id_1", "user_id_2"})
})
public class Buddy {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "user_id_1", nullable = false)
    private UUID userId1;

    @Column(name = "user_id_2", nullable = false)
    private UUID userId2;

    private boolean accepted; // To handle pending and accepted buddy requests

    private LocalDateTime createdAt;
}
