package dev.codesumeet.travelSaathi.service;

import dev.codesumeet.travelSaathi.dto.TripDTO;
import dev.codesumeet.travelSaathi.entity.Trip;
import java.util.List;
import java.util.UUID;

public interface TripService {
    
    // Create a new trip
    TripDTO createTrip(UUID userId, TripDTO tripDTO);

    // Get all trips
    List<TripDTO> getAllTrips();

    // Get trips by destination (used for filtering trips)
    List<TripDTO> getTripsByDestination(String destination);

    // Get a specific trip by ID
    TripDTO getTripById(UUID tripId);

    void expressInterestInTrip(UUID tripId, UUID interestedUserId);
}
