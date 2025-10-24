package com.foodtrendguide.foodtrendguide.repository;

import com.foodtrendguide.foodtrendguide.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}

