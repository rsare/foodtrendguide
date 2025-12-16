package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.repository.BookmarkRepository;
import com.foodtrendguide.foodtrendguide.repository.UserRepository;
import com.foodtrendguide.foodtrendguide.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.GetMapping;



@Controller
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @GetMapping("/admin")
    public String showAdminDashboard(Model model) {
        // İstatistikleri hesapla
        long totalUsers = userRepository.count();
        long totalVenues = venueRepository.count();
        long totalBookmarks = bookmarkRepository.count();

        // Verileri HTML'e gönder
        model.addAttribute("userCount", totalUsers);
        model.addAttribute("venueCount", totalVenues);
        model.addAttribute("bookmarkCount", totalBookmarks);

        // Tüm mekanları listele (Tablo için)
        model.addAttribute("venues", venueRepository.findAll());

        return "admin"; // admin.html dosyasına git
    }
}