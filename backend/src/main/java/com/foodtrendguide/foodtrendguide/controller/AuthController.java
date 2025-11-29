package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.entity.User;
import com.foodtrendguide.foodtrendguide.model.LoginRequest;
import com.foodtrendguide.foodtrendguide.repository.UserRepository;
import com.foodtrendguide.foodtrendguide.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // 👈 Bu import önemli
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    // Şifre karşılaştırmak için bunu eklemelisin
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bu e-posta zaten kullanılıyor."));
        }
        User savedUser = authService.register(user);
        return ResponseEntity.ok(Map.of("message", "Kayıt başarılı", "userId", savedUser.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        // ✅ DÜZELTİLEN KISIM BURASI:
        // .equals() yerine passwordEncoder.matches() kullanıyoruz.
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "E-posta veya şifre hatalı"));
        }

        return ResponseEntity.ok(Map.of(
                "token", "dummy-jwt-token",
                "userId", user.getId(),
                "fullName", user.getFullName() != null ? user.getFullName() : "Kullanıcı",
                "message", "Giriş başarılı"
        ));
    }
}