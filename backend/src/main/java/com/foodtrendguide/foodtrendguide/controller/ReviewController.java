package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.entity.User;
import com.foodtrendguide.foodtrendguide.model.Review;
import com.foodtrendguide.foodtrendguide.model.Venue;
import com.foodtrendguide.foodtrendguide.repository.ReviewRepository;
import com.foodtrendguide.foodtrendguide.repository.UserRepository;
import com.foodtrendguide.foodtrendguide.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://16.16.204.14")
public class ReviewController {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private VenueRepository venueRepository;

    @GetMapping("/venue/{venueId}")
    public List<Review> getVenueReviews(@PathVariable Long venueId) {
        return reviewRepository.findByVenueId(venueId);
    }

    @PostMapping("/{userId}/{venueId}")
    public Review addReview(@PathVariable Long userId, @PathVariable Long venueId, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(userId).orElseThrow();
        Venue venue = venueRepository.findById(venueId).orElseThrow();

        Review review = new Review();
        review.setText(payload.get("text"));
        review.setRating(Integer.parseInt(payload.get("rating")));
        review.setUser(user);
        review.setVenue(venue);
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }
}