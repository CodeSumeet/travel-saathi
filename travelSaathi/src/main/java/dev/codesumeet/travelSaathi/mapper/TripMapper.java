package dev.codesumeet.travelSaathi.mapper;

import dev.codesumeet.travelSaathi.dto.TripDTO;
import dev.codesumeet.travelSaathi.entity.Trip;
import dev.codesumeet.travelSaathi.entity.User;
import org.springframework.stereotype.Component;

@Component
public class TripMapper {

    // Convert Trip entity to TripDTO
    public TripDTO toDTO(Trip trip) {
        TripDTO tripDTO = new TripDTO();
        tripDTO.setId(String.valueOf(trip.getId()));
        tripDTO.setDestination(trip.getDestination());
        tripDTO.setDescription(trip.getDescription());
        tripDTO.setStartTime(trip.getStartTime());
        tripDTO.setEndTime(trip.getEndTime());
        tripDTO.setMaxTravelers(trip.getMaxTravelers());
        tripDTO.setCreatedAt(trip.getCreatedAt());

        // Add user info to the TripDTO
        User user = trip.getUser();
        if (user != null) {
            tripDTO.setUserId(String.valueOf(user.getId()));
            tripDTO.setUsername(user.getUsername());
            tripDTO.setFullName(user.getFullName());
            tripDTO.setCreatorImage(user.getProfilePicture()); // Add this line to set the creatorImage
        }

        return tripDTO;
    }

    // Convert TripDTO to Trip entity
    public Trip toEntity(TripDTO tripDTO, User user) {
        Trip trip = new Trip();
        trip.setDestination(tripDTO.getDestination());
        trip.setDescription(tripDTO.getDescription());
        trip.setStartTime(tripDTO.getStartTime());
        trip.setEndTime(tripDTO.getEndTime());
        trip.setMaxTravelers(tripDTO.getMaxTravelers());


        // Set the associated user
        trip.setUser(user);

        return trip;
    }
}
