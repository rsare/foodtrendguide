package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.model.Photo;
import com.foodtrendguide.foodtrendguide.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor

public class PhotoController {

    private final PhotoService photoService;

    @GetMapping("/venue/{venueId}")
    public List<Photo> getVenuePhotos(@PathVariable Long venueId) {
        return photoService.getVenuePhotos(venueId);
    }

    @PostMapping
    public Photo addPhoto(@RequestBody Photo photo) {
        return photoService.addPhoto(photo);
    }
}
