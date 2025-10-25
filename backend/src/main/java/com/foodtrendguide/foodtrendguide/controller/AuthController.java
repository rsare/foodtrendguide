package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.entity.User;
import com.foodtrendguide.foodtrendguide.model.LoginRequest;
import com.foodtrendguide.foodtrendguide.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5188") // frontend portunu ekledik
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        // Kullanıcıyı e-posta ile bul
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        // Kullanıcı yoksa veya şifre uyuşmuyorsa 401 döndür
        if (user == null || !request.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "E-posta veya şifre hatalı"));
        }

        // Giriş başarılıysa (şimdilik dummy token)
        return ResponseEntity.ok(Map.of(
                "token", "dummy-jwt-token",
                "message", "Login successful"
        ));
    }
}
