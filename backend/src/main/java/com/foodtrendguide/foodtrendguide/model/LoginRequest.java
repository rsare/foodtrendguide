package com.foodtrendguide.foodtrendguide.model;

import lombok.Data; // ✅ Lombok'u ekle
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data // ✅ Bu anotasyon getPassword() ve getEmail() metodlarını otomatik yazar
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}