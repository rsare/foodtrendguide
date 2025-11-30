package com.foodtrendguide.foodtrendguide.model;

import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String email;
    private String fullName;
    private String token; // Google'dan gelen token (İleride güvenlik için kullanılabilir)
}