package com.foodtrendguide.foodtrendguide.repository;

import com.foodtrendguide.foodtrendguide.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserId(Long userId);
    boolean existsByUserIdAndVenueId(Long userId, Long venueId);
}
