package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.model.Venue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class VenueController {
    @GetMapping("/api/venues")
    public List<Venue> getVenues() {
        Venue v1 = new Venue(1L, "Venue A", "Istanbul", "Kadikoy", 4.5);
        Venue v2 = new Venue(2L, "Venue B", "Ankara", "Cankaya", 4.3);

        return Arrays.asList(v1, v2);
    }}

