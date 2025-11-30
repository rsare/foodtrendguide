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
}