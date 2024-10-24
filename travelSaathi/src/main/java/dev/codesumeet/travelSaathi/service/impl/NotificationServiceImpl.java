package dev.codesumeet.travelSaathi.service.impl;

import dev.codesumeet.travelSaathi.config.NotificationAndChatWebSocketHandler;
import dev.codesumeet.travelSaathi.config.NotificationWebSocketHandler;
import dev.codesumeet.travelSaathi.dto.NotificationDTO;
import dev.codesumeet.travelSaathi.entity.Notification;
import dev.codesumeet.travelSaathi.enums.NotificationType;
import dev.codesumeet.travelSaathi.exception.ResourceNotFoundException;
import dev.codesumeet.travelSaathi.repository.NotificationRepository;
import dev.codesumeet.travelSaathi.repository.PostRepository;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import dev.codesumeet.travelSaathi.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationWebSocketHandler webSocketHandler;

    @Override
    public void createLikeNotification(UUID postId, UUID likerId) {
        // Fetch the user who liked the post
        var user = userRepository.findById(likerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String username = user.getUsername();
        String profilePicture = user.getProfilePicture(); // Fetch profile picture URL

        Notification notification = new Notification();
        notification.setType(NotificationType.LIKE);
        notification.setPostId(postId);
        notification.setActorId(likerId);
        notification.setRecipientId(postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"))
                .getUser().getId());

        // Use the username in the notification message
        notification.setMessage(username + " liked your post");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);
        notification.setProfilePicture(profilePicture); // Set the profile picture in the notification

        notificationRepository.save(notification);

        NotificationDTO notificationDTO = convertToDTO(notification);
        sendNotification(notificationDTO);
    }

    @Override
    public void createCommentNotification(UUID postId, UUID commenterId) {
        // Fetch the user who commented on the post
        var user = userRepository.findById(commenterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String username = user.getUsername();
        String profilePicture = user.getProfilePicture(); // Fetch profile picture URL

        Notification notification = new Notification();
        notification.setType(NotificationType.COMMENT);
        notification.setPostId(postId);
        notification.setActorId(commenterId);
        notification.setRecipientId(postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"))
                .getUser().getId());

        // Use the username in the notification message
        notification.setMessage(username + " commented on your post");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);
        notification.setProfilePicture(profilePicture); // Set the profile picture in the notification

        notificationRepository.save(notification);

        NotificationDTO notificationDTO = convertToDTO(notification);
        sendNotification(notificationDTO);
    }



    private void sendNotification(NotificationDTO notificationDTO) {
        System.out.println("recipient id: " + notificationDTO.getRecipientId());
        webSocketHandler.sendNotification(notificationDTO.getRecipientId(), notificationDTO);
    }

    @Override
    public List<NotificationDTO> getNotificationsForUser(UUID userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void markNotificationAsRead(UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setActorId(notification.getActorId());
        dto.setRecipientId(notification.getRecipientId());
        dto.setPostId(notification.getPostId());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setProfilePicture(notification.getProfilePicture());
        dto.setIsRead(notification.getIsRead());

        // Use the new method to get the createdAt as a formatted string
        dto.setCreatedAt(notification.getCreatedAtAsString());
        return dto;
    }


}
