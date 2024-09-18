package dev.codesumeet.travelSaathi.repository;

import dev.codesumeet.travelSaathi.entity.Comment;
import dev.codesumeet.travelSaathi.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByPostId(UUID postId);
}