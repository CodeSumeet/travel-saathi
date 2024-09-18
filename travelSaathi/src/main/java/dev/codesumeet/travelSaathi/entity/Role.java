package dev.codesumeet.travelSaathi.entity;

import dev.codesumeet.travelSaathi.enums.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private UserRole name;

    public Role(UserRole userRole) {
        this.name = userRole;
    }

    public Role() {

    }
}
