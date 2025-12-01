package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.entity.User;
import com.foodtrendguide.foodtrendguide.model.Bookmark;
import com.foodtrendguide.foodtrendguide.model.Venue;
import com.foodtrendguide.foodtrendguide.repository.BookmarkRepository;
import com.foodtrendguide.foodtrendguide.repository.UserRepository;
import com.foodtrendguide.foodtrendguide.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookmarks")
@CrossOrigin(origins = " http://16.16.204.14:8081/api")
public class BookmarkController {

    @Autowired
    private BookmarkRepository bookmarkRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VenueRepository venueRepository;

    // 1. Kullanıcının favorilerini getir
    @GetMapping("/user/{userId}")
    public List<Venue> getUserBookmarks(@PathVariable Long userId) {
        List<Bookmark> bookmarks = bookmarkRepository.findByUserId(userId);
        // Bookmark nesnesinden Venue nesnesine dönüştür
        return bookmarks.stream().map(Bookmark::getVenue).collect(Collectors.toList());
    }

    // 2. Favoriye Ekle / Çıkar (Toggle)
    @PostMapping("/{userId}/{venueId}")
    public ResponseEntity<?> toggleBookmark(@PathVariable Long userId, @PathVariable Long venueId) {
        if (bookmarkRepository.existsByUserIdAndVenueId(userId, venueId)) {
            // Varsa sil (Favoriden çıkar)
            Bookmark b = bookmarkRepository.findByUserId(userId).stream()
                    .filter(x -> x.getVenue().getId().equals(venueId)).findFirst().get();
            bookmarkRepository.delete(b);
            return ResponseEntity.ok(Map.of("status", "removed"));
        } else {
            // Yoksa ekle
            User user = userRepository.findById(userId).orElseThrow();
            Venue venue = venueRepository.findById(venueId).orElseThrow();

            Bookmark bookmark = new Bookmark();
            bookmark.setUser(user);
            bookmark.setVenue(venue);
            bookmarkRepository.save(bookmark);
            return ResponseEntity.ok(Map.of("status", "added"));
        }
    }
}