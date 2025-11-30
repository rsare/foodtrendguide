package com.foodtrendguide.foodtrendguide.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Setter
@Getter
@Data // ✅ Bu anotasyon getFullName() gibi metodları otomatik oluşturur
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String password;
}