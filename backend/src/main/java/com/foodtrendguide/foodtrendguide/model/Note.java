package com.foodtrendguide.foodtrendguide.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.foodtrendguide.foodtrendguide.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // Not başlığı (Örn: "Hafta sonu planı")
    @Column(length = 5000)
    private String content; // Not içeriği (Gidilecek mekanlar listesi vs.)

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User user;
}