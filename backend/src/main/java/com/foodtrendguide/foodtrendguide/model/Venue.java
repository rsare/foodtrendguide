package com.foodtrendguide.foodtrendguide.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // 👈 BU IMPORT ÖNEMLİ
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "venues")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String city;
    private String district;
    private String address;
    private double rating;
    private String category;

    @Column(length = 1000)
    private String imageUrl;

    // 👇 BURAYA @JsonIgnore EKLE (Sonsuz döngüyü kırar)
    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Bookmark> bookmarks;

    // 👇 BURAYA DA @JsonIgnore EKLE
    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Photo> photos;
}