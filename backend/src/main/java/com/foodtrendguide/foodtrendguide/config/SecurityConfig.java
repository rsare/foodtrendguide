package com.foodtrendguide.foodtrendguide.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configure(http))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 1. STATİK DOSYALARA KESİN İZİN (Burası ekranın beyaz kalmaması için şart)
                        .requestMatchers("/", "/index.html", "/assets/**", "/favicon.ico", "/manifest.json").permitAll()

                        // 2. API İzinleri
                        .requestMatchers("/api/auth/**", "/api/venues/**", "/api/reviews/venue/**", "/api/blog/**", "/error", "/info").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/bookmarks/**", "/api/profile/**").authenticated()

                        // Diğer her şeye izin ver (Frontend yönlendirmeleri için önemli)
                        .anyRequest().permitAll()
                )
                .headers(headers -> headers
                        .xssProtection(xss -> xss.headerValue(org.springframework.security.web.header.writers.XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                        .frameOptions(frame -> frame.deny())
                )
                .sessionManagement(session -> session
                        .sessionFixation().migrateSession()
                        .maximumSessions(1)
                );
        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);

        // BURAYA DİKKAT: Kendi domainini eklemen şart!
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5173", // Vite varsayılan portu (geliştirme için)
                "https://foodtrendguide.tech", // Production (SSL)
                "http://foodtrendguide.tech",  // Production (SSL olmazsa diye)
                "http://ec2-13-61-154-37.eu-north-1.compute.amazonaws.com:3000"
        ));

        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}