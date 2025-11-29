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

//    @Value("${google.places.api.key}")
//    private String API_KEY;

    private final String API_KEY = "AIzaSyCH_tZBEOgtxI2Imc6S-S_BlQWyEZI-YMg";

    public GooglePlacesService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Venue> fetchPlaces(String categoryQuery) {
        List<Venue> venues = new ArrayList<>();

        // Google Places API (New) URL
        String url = "https://places.googleapis.com/v1/places:searchText";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json");
            headers.add("X-Goog-Api-Key", API_KEY);

            // ✅ ÖNEMLİ: Buraya 'places.photos' alanını ekledik!
            headers.add("X-Goog-FieldMask", "places.displayName,places.formattedAddress,places.rating,places.photos");

            Map<String, Object> body = new HashMap<>();
            // İstanbul içinde ara
            body.put("textQuery", categoryQuery + " in Istanbul");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode placesNode = root.path("places");

            for (JsonNode place : placesNode) {
                Venue venue = new Venue();

                // İsim
                String name = place.path("displayName").path("text").asText();
                venue.setName(name);
                venue.setCity("İstanbul");

                // Adres ve İlçe
                String fullAddress = place.path("formattedAddress").asText();
                venue.setAddress(fullAddress);
                venue.setDistrict(extractDistrictFromAddress(fullAddress));

                // Puan
                double rating = place.path("rating").asDouble();
                venue.setRating(rating > 0 ? rating : 4.0);

                // Kategori
                venue.setCategory(translateCategory(categoryQuery));

                // 🔥 FOTOĞRAF ÇEKME İŞLEMİ (New API Versiyonu) 🔥
                JsonNode photos = place.path("photos");
                if (photos.isArray() && photos.size() > 0) {
                    // 1. Fotoğrafın kaynak kodunu (Resource Name) alıyoruz
                    // Örnek: "places/PLACE_ID/photos/PHOTO_ID"
                    String photoResourceName = photos.get(0).path("name").asText();

                    // 2. Bu kodu kullanarak çalışan bir resim URL'si oluşturuyoruz
                    // maxWidthPx=400 diyerek resmi optimize ediyoruz (Hızlı açılsın diye)
                    String googlePhotoUrl = "https://places.googleapis.com/v1/" + photoResourceName + "/media?key=" + API_KEY + "&maxWidthPx=400";

                    venue.setImageUrl(googlePhotoUrl);
                } else {
                    // Eğer mekanın resmi yoksa, boş kalmasın diye stok foto koy
                    venue.setImageUrl(getDefaultImage(categoryQuery));
                }

                venues.add(venue);
            }

        } catch (Exception e) {
            System.err.println("Google API Hatası: " + e.getMessage());
            e.printStackTrace();
        }
        return venues;
    }

    // --- YARDIMCI METODLAR ---

    private String extractDistrictFromAddress(String address) {
        String[] districts = {"Beşiktaş", "Kadıköy", "Fatih", "Beyoğlu", "Şişli", "Üsküdar", "Sarıyer", "Ataşehir", "Bakırköy", "Maltepe", "Pendik", "Eyüp", "Kartal", "Beykoz", "Başakşehir", "Zeytinburnu", "Bağcılar", "Bahçelievler"};
        for (String d : districts) {
            if (address.contains(d)) return d;
        }
        return "Merkez";
    }

    private String translateCategory(String query) {
        if (query.contains("Dessert") || query.contains("Baklava")) return "Tatlı";
        if (query.contains("Coffee")) return "Kahve";
        if (query.contains("Burger") || query.contains("Restaurant")) return "Tuzlu";
        return "Genel";
    }

    // Yedek Resim Metodu
    private String getDefaultImage(String category) {
        if (category.contains("Dessert")) return "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600";
        if (category.contains("Coffee")) return "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600";
        return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600";
    }
}