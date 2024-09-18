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
//    private final NotificationAndChatWebSocketHandler webSocketHandler;
    private final NotificationWebSocketHandler webSocketHandler;

    @Override
    public void createLikeNotification(UUID postId, UUID likerId) {
        Notification notification = new Notification();
        notification.setType(NotificationType.LIKE);
        notification.setPostId(postId);
        notification.setActorId(likerId);
        notification.setRecipientId(postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"))
                .getUser().getId());

        notification.setMessage("User liked your post");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);

        notificationRepository.save(notification);

        NotificationDTO notificationDTO = convertToDTO(notification);
        sendNotification(notificationDTO);
    }

    @Override
    public void createCommentNotification(UUID postId, UUID commenterId) {
        Notification notification = new Notification();
        notification.setType(NotificationType.COMMENT);
        notification.setPostId(postId);
        notification.setActorId(commenterId);
        notification.setRecipientId(postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"))
                .getUser().getId());

        notification.setMessage("User commented on your post");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);

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
//        dto.setCreatedAt(notification.getCreatedAt());
        dto.setIsRead(notification.getIsRead());
        return dto;
    }
}
