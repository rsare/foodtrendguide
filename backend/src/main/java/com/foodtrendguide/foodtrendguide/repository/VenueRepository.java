package com.foodtrendguide.foodtrendguide.repository;

import com.foodtrendguide.foodtrendguide.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository extends JpaRepository<Venue, Long> {
    // ✅ YENİ EKLENDİ: İsme göre var mı yok mu kontrolü
    boolean existsByName(String name);
}