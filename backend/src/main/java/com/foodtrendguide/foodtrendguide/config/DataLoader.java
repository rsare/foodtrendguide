package com.foodtrendguide.foodtrendguide.config;

import com.foodtrendguide.foodtrendguide.model.Venue;
import com.foodtrendguide.foodtrendguide.repository.VenueRepository;
import com.foodtrendguide.foodtrendguide.service.GooglePlacesService; // 👈 Yeni servis
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final VenueRepository venueRepository;
    private final GooglePlacesService googleService; // 👈 Değişti

    public DataLoader(VenueRepository venueRepository, GooglePlacesService googleService) {
        this.venueRepository = venueRepository;
        this.googleService = googleService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Veritabanı boşsa çalıştır
        if (venueRepository.count() == 0) {
            System.out.println("⏳ Google Maps API'den veriler çekiliyor...");

            // Google'da aranacak İngilizce terimler (Google İngilizceyi sever)
            // Ama biz kaydederken Türkçeye çeviriyoruz (Service içinde)
            String[] searches = {"Best Dessert shops", "Popular Coffee shops", "Best Burger Restaurants"};

            for (String query : searches) {
                List<Venue> venues = googleService.fetchPlaces(query);

                for (Venue v : venues) {
                    // Aynı mekanı tekrar kaydetme
                    if (!venueRepository.existsByName(v.getName())) {
                        venueRepository.save(v);
                    }
                }

                System.out.println("✅ '" + query + "' sorgusu tamamlandı.");
                Thread.sleep(1000); // Nezaketen bekleme
            }

            System.out.println("🚀 Tüm veriler Google'dan başarıyla yüklendi!");
        }
    }
}