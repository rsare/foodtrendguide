package com.foodtrendguide.foodtrendguide.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.foodtrendguide.foodtrendguide.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "blog_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // Yazı Başlığı

    @Column(columnDefinition = "TEXT") // Uzun yazılar için
    private String content;

    private String imageUrl; // Kapak resmi (Opsiyonel)

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User author; // Yazarı
}