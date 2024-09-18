package dev.codesumeet.travelSaathi.service;

import dev.codesumeet.travelSaathi.dto.NotificationDTO;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    void createLikeNotification(UUID postId, UUID likerId);
    void createCommentNotification(UUID postId, UUID commenterId);
    List<NotificationDTO> getNotificationsForUser(UUID userId);
    void markNotificationAsRead(UUID notificationId);
}
