package com.foodtrendguide.foodtrendguide.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int stars;
    private String comment;

    @ManyToOne
    private User user;

    @ManyToOne
    private Venue venue;
}
