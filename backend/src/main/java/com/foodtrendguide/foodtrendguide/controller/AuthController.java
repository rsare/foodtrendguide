package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.entity.User;
import com.foodtrendguide.foodtrendguide.dto.LoginRequest;
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
    private com.foodtrendguide.foodtrendguide.service.AuthService authService;

    @Autowired
    private com.foodtrendguide.foodtrendguide.repository.UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Basit bir kontrol: E-posta var mı?
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bu e-posta zaten kullanılıyor."));
        }
        // Yoksa kaydet
        User savedUser = authService.register(user);
        return ResponseEntity.ok(Map.of("message", "Kayıt başarılı", "userId", savedUser.getId()));
    }
}
