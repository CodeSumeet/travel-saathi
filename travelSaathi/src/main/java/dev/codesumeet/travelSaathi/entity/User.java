package dev.codesumeet.travelSaathi.entity;

import dev.codesumeet.travelSaathi.enums.AccountStatus;
import dev.codesumeet.travelSaathi.enums.Gender;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String fullName;

    @Column(name = "profile_picture")
    private String profilePicture;

    private LocalDateTime dob;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String contactNumber;
    private String city;
    private String state;
    private String country;

    @Column(columnDefinition = "TEXT")
    private String about;

    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "host", fetch = FetchType.EAGER)
    private Set<GroupTrip> hostedTrips;

    @OneToMany(mappedBy = "guide", fetch = FetchType.EAGER)
    private Set<GuideService> guideServices;

    @OneToMany(mappedBy = "userId1", fetch = FetchType.EAGER)
    private Set<Buddy> buddiesAsUser1 = new HashSet<>();

    @OneToMany(mappedBy = "userId2", fetch = FetchType.EAGER)
    private Set<Buddy> buddiesAsUser2 = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
}
