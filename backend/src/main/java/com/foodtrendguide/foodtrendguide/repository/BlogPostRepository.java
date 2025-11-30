package com.foodtrendguide.foodtrendguide.repository;

import com.foodtrendguide.foodtrendguide.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findAllByOrderByCreatedAtDesc();
    List<BlogPost> findByAuthorId(Long userId);
    // Buraya başka bir şey eklemene gerek yok, findById zaten JpaRepository içinde var.
}