package dev.codesumeet.travelSaathi.service.impl;

import dev.codesumeet.travelSaathi.dto.TripDTO;
import dev.codesumeet.travelSaathi.entity.ConnectionRequest;
import dev.codesumeet.travelSaathi.entity.Trip;
import dev.codesumeet.travelSaathi.entity.User;
import dev.codesumeet.travelSaathi.enums.ConnectionRequestStatus;
import dev.codesumeet.travelSaathi.exception.BadRequestException;
import dev.codesumeet.travelSaathi.exception.ResourceNotFoundException;
import dev.codesumeet.travelSaathi.exception.UserNotFoundException;
import dev.codesumeet.travelSaathi.mapper.TripMapper;
import dev.codesumeet.travelSaathi.repository.ConnectionRequestRepository;
import dev.codesumeet.travelSaathi.repository.TripRepository;
import dev.codesumeet.travelSaathi.repository.UserRepository;
import dev.codesumeet.travelSaathi.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TripMapper tripMapper;
//    private final NotificationService notificationService;
    private final ConnectionRequestRepository connectionRequestRepository;

    @Override
    @Transactional
    public TripDTO createTrip(UUID userId, TripDTO tripDTO) {
        // Fetch the user associated with the trip
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        // Convert TripDTO to Trip entity
        Trip trip = tripMapper.toEntity(tripDTO, user);

        // Save the trip
        Trip savedTrip = tripRepository.save(trip);

        // Convert the saved Trip entity back to DTO and return it
        return tripMapper.toDTO(savedTrip);
    }

    @Override
    public List<TripDTO> getAllTrips() {
        List<Trip> trips = tripRepository.findAll();
        return trips.stream()
                .map(tripMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TripDTO> getTripsByDestination(String destination) {
        return tripRepository.findByDestinationIgnoreCase(destination).stream()
                .map(tripMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TripDTO getTripById(UUID tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + tripId));

        return tripMapper.toDTO(trip);
    }

    @Transactional
    public void expressInterestInTrip(UUID tripId, UUID interestedUserId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        // Check if the user is not expressing interest in their own trip
        if (trip.getId().equals(interestedUserId)) {
            throw new BadRequestException("You cannot express interest in your own trip");
        }

        // Check if a connection request already exists
        boolean requestExists = connectionRequestRepository.existsByTripIdAndInterestedUserId(tripId, interestedUserId);
        if (requestExists) {
            throw new BadRequestException("You have already expressed interest in this trip");
        }

        // Create a new connection request
        ConnectionRequest connectionRequest = new ConnectionRequest();
        connectionRequest.setTripId(tripId);
        connectionRequest.setTripOwnerId(trip.getId());
        connectionRequest.setInterestedUserId(interestedUserId);
        connectionRequest.setStatus(ConnectionRequestStatus.PENDING);
        connectionRequest.setCreatedAt(LocalDateTime.now());

        connectionRequestRepository.save(connectionRequest);

        // Create a notification for the trip owner
//        notificationService.createTripInterestNotification(tripId, interestedUserId);
    }
}
