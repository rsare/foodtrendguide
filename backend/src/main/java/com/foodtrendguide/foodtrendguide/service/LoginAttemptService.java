package com.foodtrendguide.foodtrendguide.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// PDF Sayfa 18 Referansı [cite: 286]
@Service
public class LoginAttemptService {
    private final Map<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 5; // 5 başarısız denemede kitle [cite: 288]

    public void loginFailed(String username) {
        int attempts = attemptsCache.getOrDefault(username, 0);
        attemptsCache.put(username, attempts + 1);
    }

    public boolean isBlocked(String username) {
        return attemptsCache.getOrDefault(username, 0) >= MAX_ATTEMPTS;
    }

    public void loginSucceeded(String username) {
        attemptsCache.remove(username); // Başarılı girişte sayacı sıfırla [cite: 296]
    }
}