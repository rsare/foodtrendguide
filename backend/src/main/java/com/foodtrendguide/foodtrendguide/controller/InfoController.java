package com.foodtrendguide.foodtrendguide.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Controller // ⚠️ Dikkat: @RestController DEĞİL, @Controller kullanıyoruz (HTML döneceği için)
public class InfoController {

    @GetMapping("/info")
    public String showInfoPage(Model model) {
        // Bu verileri Backend'den HTML'e gönderiyoruz (Server-Side Rendering)
        model.addAttribute("appName", "FoodTrend Guide");
        model.addAttribute("studentName", "Rumeysa Sare"); // Kendi adın
        model.addAttribute("version", "v1.0.0");
        model.addAttribute("serverTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")));

        // "info" stringi, resources/templates/info.html dosyasını işaret eder
        return "info";
    }
}