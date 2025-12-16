package com.foodtrendguide.foodtrendguide.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    // Gelen tüm sayfa isteklerini "static/index.html"e (React'e) yönlendiriyoruz.
    // Spring Boot, "templates" içinde index.html bulamazsa, otomatik olarak "static/index.html"i sunar.
    @GetMapping(value = {
            "/",
            "/home",
            "/login",
            "/register",
            "/explore",
            "/profile",
            "/bookmarks",
            "/favorites",
            "/venue/**"
    })
    public String forwardToReact() {
        // "forward:/" demek, isteği tekrar ana sayfaya gönder demektir.
        // Bu sayede React'in index.html dosyası yüklenir.
        return "forward:/index.html";
    }
}