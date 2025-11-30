package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.entity.User;
import com.foodtrendguide.foodtrendguide.repository.UserRepository;
import com.foodtrendguide.foodtrendguide.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.foodtrendguide.foodtrendguide.model.GoogleLoginRequest;


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


    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        // Servisteki metodu çağır (Kaydet veya Bul)
        User user = authService.loginWithGoogle(request.getEmail(), request.getFullName());

        // 🔥 Frontende GERÇEK UserID'yi dönüyoruz
        return ResponseEntity.ok(Map.of(
                "token", "dummy-jwt-token-google",
                "userId", user.getId(), // Bu ID not ve blog eklerken lazım olacak
                "fullName", user.getFullName(),
                "message", "Google ile giriş başarılı"
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bu e-posta zaten kullanılıyor."));
        }
        User savedUser = authService.register(user);
        return ResponseEntity.ok(Map.of("message", "Kayıt başarılı", "userId", savedUser.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody com.foodtrendguide.foodtrendguide.model.LoginRequest request) {
        System.out.println("🔍 Giriş İsteği: " + request.getEmail());

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            System.out.println("❌ Kullanıcı veritabanında bulunamadı!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Kullanıcı yok"));
        }

        System.out.println("✅ Kullanıcı bulundu. DB Şifre: " + user.getPassword());
        System.out.println("🔑 Girilen Şifre: " + request.getPassword());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.out.println("❌ Şifreler Eşleşmedi! (Hash kontrolü başarısız)");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Şifre hatalı"));
        }

        System.out.println("🚀 Giriş Başarılı!");
        return ResponseEntity.ok(Map.of(
                "token", "dummy-jwt-token",
                "userId", user.getId(),
                "fullName", user.getFullName() != null ? user.getFullName() : "Kullanıcı",
                "message", "Giriş başarılı"
        ));
    }


}