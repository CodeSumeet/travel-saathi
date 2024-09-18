package dev.codesumeet.travelSaathi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Set;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "guide_services")
public class GuideService {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "guide_id", nullable = false)
    private User guide;

    private String serviceName;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer rateAmount;
    private String rateCurrency;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "guideService")
    private Set<GuideBooking> bookings;

    // Getters, setters, and other methods...
}
