package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.entity.User;
import com.foodtrendguide.foodtrendguide.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Şifreleme için gerekli
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ✅ KULLANICI GÜNCELLEME (UPDATE)
    @PutMapping("/{id}")
    public Map<String, String> updateUser(@PathVariable Long id, @RequestBody Map<String, String> updateRequest) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        // İsim güncelleme isteği varsa
        if (updateRequest.containsKey("fullName")) {
            user.setFullName(updateRequest.get("fullName"));
        }

        // Şifre güncelleme isteği varsa (Boş değilse)
        if (updateRequest.containsKey("password") && !updateRequest.get("password").isEmpty()) {
            String newPassword = updateRequest.get("password");
            user.setPassword(passwordEncoder.encode(newPassword)); // Şifreyi hashleyerek kaydet
        }

        userRepository.save(user);

        return Map.of("message", "Profil başarıyla güncellendi!");
    }

    // ✅ KULLANICI BİLGİSİ GETİRME (READ)
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
    }
}