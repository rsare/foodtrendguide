package com.foodtrendguide.foodtrendguide.repository;

import com.foodtrendguide.foodtrendguide.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}

