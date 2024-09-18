package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.Post;
import dev.codesumeet.travelSaathi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByUser(User user);
}