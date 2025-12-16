package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.entity.User;
import com.foodtrendguide.foodtrendguide.model.GoogleLoginRequest;
import com.foodtrendguide.foodtrendguide.model.LoginRequest;
import com.foodtrendguide.foodtrendguide.repository.UserRepository;
import com.foodtrendguide.foodtrendguide.service.AuthService;
import com.foodtrendguide.foodtrendguide.service.LoginAttemptService; // PDF Sayfa 18 gereği eklendi
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/auth")
// @CrossOrigin kaldırıldı çünkü CorsConfig.java içinde global olarak ayarlandı.
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginAttemptService loginAttemptService; // Rate Limiting Servisi

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ✅ GOOGLE İLE GİRİŞ
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        // Servisteki metodu çağır (Kaydet veya Bul)
        User user = authService.loginWithGoogle(request.getEmail(), request.getFullName());

        // Google girişlerinde genelde Rate Limit uygulanmaz veya daha esnek tutulur.
        // Başarılı girişte sayacı sıfırlamak iyi bir pratiktir.
        loginAttemptService.loginSucceeded(request.getEmail());

        return ResponseEntity.ok(Map.of(
                "token", "dummy-jwt-token-google", // İleride gerçek JWT eklenebilir
                "userId", user.getId(),
                "fullName", user.getFullName(),
                "message", "Google ile giriş başarılı"
        ));
    }

    // ✅ KULLANICI KAYDI
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bu e-posta zaten kullanılıyor."));
        }
        User savedUser = authService.register(user);
        return ResponseEntity.ok(Map.of("message", "Kayıt başarılı", "userId", savedUser.getId()));
    }

    // ✅ GÜVENLİ GİRİŞ (RATE LIMITING İÇERİR)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String email = request.getEmail();

        // 1. ADIM: Kullanıcı engelli mi kontrol et (PDF Sayfa 18 - Rate Limiting)
        if (loginAttemptService.isBlocked(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Çok fazla başarısız deneme yaptınız. Lütfen daha sonra tekrar deneyin."));
        }

        User user = userRepository.findByEmail(email).orElse(null);

        // 2. ADIM: Kullanıcı yoksa veya şifre yanlışsa
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            // Başarısız denemeyi kaydet
            loginAttemptService.loginFailed(email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "E-posta veya şifre hatalı"));
        }

        // 3. ADIM: Giriş Başarılı
        // Başarılı olduğu için hatalı giriş sayacını sıfırla (PDF Sayfa 18) [cite: 295]
        loginAttemptService.loginSucceeded(email);

        return ResponseEntity.ok(Map.of(
                "token", "dummy-jwt-token",
                "userId", user.getId(),
                "fullName", user.getFullName() != null ? user.getFullName() : "Kullanıcı",
                "message", "Giriş başarılı"
        ));
    }
}