package dev.codesumeet.travelSaathi.entity;

import dev.codesumeet.travelSaathi.enums.ConnectionRequestStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "connection_requests")
@Data
public class ConnectionRequest {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "trip_id")
    private UUID tripId;

    @Column(name = "trip_owner_id")
    private UUID tripOwnerId;

    @Column(name = "interested_user_id")
    private UUID interestedUserId;

    @Enumerated(EnumType.STRING)
    private ConnectionRequestStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}