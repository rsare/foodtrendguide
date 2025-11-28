package com.foodtrendguide.foodtrendguide.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodtrendguide.foodtrendguide.model.Venue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GooglePlacesService {

    private final RestTemplate restTemplate;


    //private final String API_KEY = "AIzaSyCH_tZBEOgtxI2Imc6S-S_BlQWyEZI-YMg";
    @Value("${google.places.api.key}")
    private String API_KEY;

    public GooglePlacesService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Venue> fetchPlaces(String categoryQuery) {
        List<Venue> venues = new ArrayList<>();

        // Google Places API (New) URL
        String url = "https://places.googleapis.com/v1/places:searchText";

        try {
            // 1. HEADERS: API Key ve Hangi Alanları İstediğimizi Belirtiyoruz
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json");
            headers.add("X-Goog-Api-Key", API_KEY);
            // Sadece ihtiyacımız olan alanları istiyoruz (Kota dostu)
            headers.add("X-Goog-FieldMask", "places.displayName,places.formattedAddress,places.rating,places.priceLevel");

            // 2. BODY: Ne arıyoruz?
            Map<String, Object> body = new HashMap<>();
            // Örn: "Dessert shops in Istanbul"
            body.put("textQuery", categoryQuery + " in Istanbul");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // 3. İSTEĞİ GÖNDER (POST)
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            // 4. JSON PARSE İŞLEMİ
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode placesNode = root.path("places");

            for (JsonNode place : placesNode) {
                Venue venue = new Venue();

                // İsim
                String name = place.path("displayName").path("text").asText();
                venue.setName(name);
                venue.setCity("İstanbul");

                // Adres
                String fullAddress = place.path("formattedAddress").asText();
                venue.setAddress(fullAddress);

                // İLÇE AYIKLAMA (Google tam adres verir, içinden ilçeyi bulmamız lazım)
                String district = extractDistrictFromAddress(fullAddress);
                venue.setDistrict(district);

                // Puan (Google vermediyse varsayılan 4.0 ata)
                double rating = place.path("rating").asDouble();
                venue.setRating(rating > 0 ? rating : 4.0);

                // Kategori (Aranan kelimeyi kategori yap)
                // categoryQuery genelde "Dessert" gelir, biz onu "Tatlı" yapalım
                venue.setCategory(translateCategory(categoryQuery));

                // Resim: Google Fotoğrafları çekmek ayrı bir API isteği ve maliyet gerektirir.
                // Proje için en mantıklısı, kategoriye uygun kaliteli stok foto kullanmaktır.
                String imgKeyword = getImgKeyword(categoryQuery);
                // URL sonuna name.hashCode ekleyerek her mekana sabit ama farklı resim atıyoruz
                venue.setImageUrl(getSmartImage(venue.getName(), venue.getCategory()));

                venues.add(venue);
            }

        } catch (Exception e) {
            System.err.println("Google API Hatası: " + e.getMessage());
            e.printStackTrace();
        }
        return venues;
    }

    // Adres içinden ilçe bulma (Basit parser)
    private String extractDistrictFromAddress(String address) {
        // İstanbul ilçelerinin listesi
        String[] districts = {"Beşiktaş", "Kadıköy", "Fatih", "Beyoğlu", "Şişli", "Üsküdar", "Sarıyer", "Ataşehir", "Bakırköy", "Maltepe", "Pendik", "Eyüp", "Kartal", "Beykoz", "Başakşehir"};

        for (String d : districts) {
            if (address.contains(d)) {
                return d;
            }
        }
        return "Merkez"; // Bulamazsa
    }

    // İngilizce aramayı Türkçe kategoriye çevirme
    private String translateCategory(String query) {
        if (query.contains("Dessert") || query.contains("Baklava")) return "Tatlı";
        if (query.contains("Coffee")) return "Kahve";
        if (query.contains("Burger") || query.contains("Restaurant")) return "Tuzlu";
        return "Genel";
    }

    // Resim için anahtar kelime
    private String getImgKeyword(String query) {
        if (query.contains("Dessert")) return "dessert";
        if (query.contains("Coffee")) return "coffee";
        return "burger";
    }


    // 👇 BU METODU SERVİS SINIFININ EN ALTINA EKLE
    private String getSmartImage(String venueName, String category) {
        String lowerName = venueName.toLowerCase();

        // 1. MARKA BAZLI ÖZEL FOTOĞRAFLAR (Gerçekçi görünüm için en önemlisi)
        if (lowerName.contains("hafiz mustafa") || lowerName.contains("hafız mustafa")) {
            return "https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?q=80&w=600&auto=format&fit=crop"; // Baklava/Tatlı tabağı
        }
        if (lowerName.contains("starbucks")) {
            return "https://images.unsplash.com/photo-1571327073757-71d13c24de30?q=80&w=600&auto=format&fit=crop"; // Starbucks bardağı
        }
        if (lowerName.contains("espressolab") || lowerName.contains("kahve dünyası") || lowerName.contains("viyana")) {
            return "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop"; // Şık 3. dalga kahveci
        }
        if (lowerName.contains("nusr-et") || lowerName.contains("nusret") || lowerName.contains("steak")) {
            return "https://images.unsplash.com/photo-1546252449-b0c618051a89?q=80&w=600&auto=format&fit=crop"; // Kaliteli Steak
        }
        if (lowerName.contains("burger") || lowerName.contains("shake shack") || lowerName.contains("zula")) {
            return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop"; // Sulu Burger
        }
        if (lowerName.contains("midpoint") || lowerName.contains("big chefs") || lowerName.contains("happy")) {
            return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop"; // Şık Restoran masası
        }
        if (lowerName.contains("sushi") || lowerName.contains("çin") || lowerName.contains("asian")) {
            return "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop"; // Sushi
        }
        if (lowerName.contains("pizza")) {
            return "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop"; // Pizza
        }

        // 2. KATEGORİ BAZLI GENEL YÜKSEK KALİTE FOTOĞRAFLAR
        // Eğer özel marka yoksa kategoriye göre en iyi resmi ver
        if (category.equalsIgnoreCase("Tatlı") || category.contains("Dessert")) {
            return "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=600&auto=format&fit=crop"; // Genel Tatlı
        }
        if (category.equalsIgnoreCase("Kahve") || category.contains("Coffee")) {
            return "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop"; // Genel Kahve
        }
        if (category.equalsIgnoreCase("Sağlıklı") || category.contains("Salad") || category.contains("Healthy")) {
            return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop"; // Salata/Sağlıklı
        }

        // 3. HİÇBİRİNE UYMAZSA (Varsayılan Şık Restoran Resmi)
        return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop";
    }
}