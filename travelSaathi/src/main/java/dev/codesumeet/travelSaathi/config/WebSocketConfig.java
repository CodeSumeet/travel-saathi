package dev.codesumeet.travelSaathi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final NotificationWebSocketHandler notificationWebSocketHandler;
    private final ChatWebSocketHandler chatWebSocketHandler;

    public WebSocketConfig(NotificationWebSocketHandler notificationWebSocketHandler,
                           ChatWebSocketHandler chatWebSocketHandler) {
        this.notificationWebSocketHandler = notificationWebSocketHandler;
        this.chatWebSocketHandler = chatWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(notificationWebSocketHandler, "/notifications")
                .setAllowedOrigins("*");
        registry.addHandler(chatWebSocketHandler, "/chat")
                .setAllowedOrigins("*");
    }
}








//package dev.codesumeet.travelSaathi.config;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.socket.config.annotation.EnableWebSocket;
//import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
//import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
//
//@Configuration
//@EnableWebSocket
//@RequiredArgsConstructor
//public class WebSocketConfig implements WebSocketConfigurer {
//
//    private final NotificationAndChatWebSocketHandler notificationWebSocketHandler;
//    private final NotificationAndChatWebSocketHandler chatWebSocketHandler;
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        registry.addHandler(notificationWebSocketHandler, "/notifications")
//                .setAllowedOrigins("*");
//        registry.addHandler(chatWebSocketHandler, "/chat")
//                .setAllowedOrigins("*");
//    }
//}
