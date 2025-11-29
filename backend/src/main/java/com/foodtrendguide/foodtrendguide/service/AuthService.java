package com.foodtrendguide.foodtrendguide.service;

import com.foodtrendguide.foodtrendguide.entity.User;
import com.foodtrendguide.foodtrendguide.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // 👈 Bu import şart
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    // 👇 Bu arkadaşı eklemelisin
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {
        // ⚠️ DİKKAT: Şifreyi veritabanına yazmadan önce ŞİFRELEMEMİZ lazım!
        // Eski hali: user.getPassword() ise HATA verir.
        // Yeni hali:
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public Optional<User> login(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && passwordEncoder.matches(rawPassword, userOpt.get().getPassword())) {
            return userOpt;
        }
        return Optional.empty();
    }
}