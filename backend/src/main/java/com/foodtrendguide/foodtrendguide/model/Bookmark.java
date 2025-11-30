package com.foodtrendguide.foodtrendguide.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // 👈 Import
import com.foodtrendguide.foodtrendguide.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "bookmarks")
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "bookmarks", "photos"})
    private Venue venue;
}