package com.foodtrendguide.foodtrendguide.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodtrendguide.foodtrendguide.model.Venue;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.List;

// ... importlar aynı
@Service
public class OpenStreetMapService {

    private final RestTemplate restTemplate;

    public OpenStreetMapService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Venue> fetchVenuesFromApi(String city, String query) {
        List<Venue> venues = new ArrayList<>();
        String url = "https://nominatim.openstreetmap.org/search?q=" + query + "+" + city + "&format=json&addressdetails=1&limit=15"; // Limiti biraz artırdım

        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(jsonResponse);

            for (JsonNode node : root) {
                String name = node.path("name").asText();
                if (name == null || name.isEmpty() || name.equalsIgnoreCase("Restaurant") || name.equalsIgnoreCase("Cafe")) continue;

                Venue venue = new Venue();
                venue.setName(name);
                venue.setCity(city);

                // ✅ İLÇE BİLGİSİNİ ALMA (OSM'de farklı isimlerle gelebilir)
                JsonNode addressNode = node.path("address");
                String district = "";
                if (addressNode.has("suburb")) district = addressNode.get("suburb").asText();
                else if (addressNode.has("town")) district = addressNode.get("town").asText();
                else if (addressNode.has("county")) district = addressNode.get("county").asText();

                venue.setDistrict(district.isEmpty() ? "Merkez" : district); // Bulamazsa Merkez yazsın

                String road = addressNode.path("road").asText();
                venue.setAddress(road.isEmpty() ? district : road + ", " + district);

                venue.setRating(3.5 + (Math.random() * 1.5));
                venue.setCategory(query); // Kategori aramadan gelsin

                long osmId = node.path("osm_id").asLong();
                // Resim mantığını koruduk
                String imgCategory = query.equals("Tatlı") || query.contains("Baklava") ? "dessert" :
                        query.equals("Kahve") ? "coffee" : "food";
                venue.setImageUrl("https://loremflickr.com/320/240/" + imgCategory + "?random=" + osmId);

                venues.add(venue);
            }
        } catch (Exception e) {
            System.err.println("API Hatası: " + e.getMessage());
        }
        return venues;
    }
}