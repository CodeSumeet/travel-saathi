package dev.codesumeet.travelSaathi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebSocketController {

    @GetMapping("/notifications/info")
    public ResponseEntity<String> getInfo() {
        return ResponseEntity.ok("{\"protocols\": [\"websocket\"], \"cookie_needed\": false}");
    }
}
