package dev.codesumeet.travelSaathi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "posts")
@Getter
@Setter
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    // Use PostLike instead of Like, using EAGER fetching for likes to ensure likes are loaded with the post
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<PostLike> likes = new HashSet<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<Comment> comments = new HashSet<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    // Helper method to manage the bidirectional relationship when adding a like
    public void addLike(PostLike like) {
        likes.add(like);
        like.setPost(this); // Set the post in PostLike entity to this Post instance
    }

    // Helper method to manage the bidirectional relationship when removing a like
    public void removeLike(PostLike like) {
        likes.remove(like);
        like.setPost(null); // Break the reference to avoid any lingering relations
    }

    public int getLikesCount() {
        return likes.size();
    }
    public int getCommentsCount() {return comments.size();}
}
