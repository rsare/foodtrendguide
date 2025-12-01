package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.model.Venue;
import com.foodtrendguide.foodtrendguide.service.VenueService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@CrossOrigin(origins = " http://16.16.204.14:8081/api") // Vite portunu yaz
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @GetMapping
    public List<Venue> list() {
        // ✅ Frontend "findAll" ya da "getAllVenues" fark etmeksizin çalışsın:
        return venueService.findAll(); // veya venueService.getAllVenues();
    }
}

