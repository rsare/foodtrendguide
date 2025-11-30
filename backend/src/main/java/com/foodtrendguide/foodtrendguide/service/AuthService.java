package com.foodtrendguide.foodtrendguide.service;

import com.foodtrendguide.foodtrendguide.entity.User;
import com.foodtrendguide.foodtrendguide.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {
        // 🔥 BURASI ÇOK ÖNEMLİ: Şifreyi Hash'leyip (Şifreleyip) kaydediyoruz
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }

    // Login metodu burada kullanılmıyor (Controller'da yapıyoruz) ama kalabilir
    public Optional<User> login(String email, String rawPassword) {
        return Optional.empty();
    }

    // Google ile giriş/kayıt işlemi
    public User loginWithGoogle(String email, String fullName) {
        // 1. Veritabanında bu mail ile kullanıcı var mı?
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            // Varsa, o kullanıcıyı döndür (Giriş yap)
            return existingUser.get();
        } else {
            // Yoksa, YENİ KULLANICI OLUŞTUR (Kayıt ol)
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(fullName);
            // Google ile girenlerin şifresi olmaz ama veritabanı null sevmezse rastgele bir şey atayalım
            newUser.setPassword(passwordEncoder.encode("GOOGLE_USER_" + System.currentTimeMillis()));

            return userRepository.save(newUser);
        }
    }
}