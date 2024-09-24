package dev.codesumeet.travelSaathi.controller;

import dev.codesumeet.travelSaathi.dto.TripDTO;
import dev.codesumeet.travelSaathi.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    // Endpoint to create a new trip
    @PostMapping("/create-trip")
    public ResponseEntity<TripDTO> createTrip(
            @RequestParam("userId") UUID userId, 
            @RequestBody TripDTO tripDTO) {

        System.out.println(userId);
        
        TripDTO createdTrip = tripService.createTrip(userId, tripDTO);
        return ResponseEntity.ok(createdTrip);
    }

    // Endpoint to fetch all trips
    @GetMapping("/all-trips")
    public ResponseEntity<List<TripDTO>> getAllTrips() {
        List<TripDTO> trips = tripService.getAllTrips();
        return ResponseEntity.ok(trips);
    }

    // Endpoint to fetch trips by destination
    @GetMapping("/destination")
    public ResponseEntity<List<TripDTO>> getTripsByDestination(
            @RequestParam("destination") String destination) {
        
        List<TripDTO> trips = tripService.getTripsByDestination(destination);
        return ResponseEntity.ok(trips);
    }

    // Endpoint to fetch trip details by trip ID
    @GetMapping("/{tripId}")
    public ResponseEntity<TripDTO> getTripById(@PathVariable UUID tripId) {
        TripDTO trip = tripService.getTripById(tripId);
        return ResponseEntity.ok(trip);
    }

    @PostMapping("/{tripId}/express-interest")
    public ResponseEntity<Map<String, Object>> expressInterestInTrip(
            @PathVariable UUID tripId,
            @RequestParam UUID userId) {
        System.out.println("Trip ID: " + tripId);
        System.out.println("User ID: " + userId);
        tripService.expressInterestInTrip(tripId, userId);
        return ResponseEntity.ok(Map.of("message", "Interest expressed successfully"));
    }
}
