package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.Post;
import dev.codesumeet.travelSaathi.entity.PostLike;
import dev.codesumeet.travelSaathi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, UUID> {
    Optional<PostLike> findByUserAndPost(User user, Post post);
    int countByPost(Post post);  // Method to count likes of a post
}
