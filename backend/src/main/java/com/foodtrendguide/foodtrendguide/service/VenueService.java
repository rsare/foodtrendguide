package com.foodtrendguide.foodtrendguide.service;

import com.foodtrendguide.foodtrendguide.model.Venue;
import com.foodtrendguide.foodtrendguide.repository.VenueRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VenueService {
    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    public Venue addVenue(Venue venue) {
        return venueRepository.save(venue);
    }

    public List<Venue> findAll() {
        return venueRepository.findAll();
    }
}
