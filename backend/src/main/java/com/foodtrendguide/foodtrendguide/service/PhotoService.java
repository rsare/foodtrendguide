package com.foodtrendguide.foodtrendguide.service;

import com.foodtrendguide.foodtrendguide.model.Photo;
import com.foodtrendguide.foodtrendguide.repository.PhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;

    public List<Photo> getVenuePhotos(Long venueId) {
        return photoRepository.findByVenueId(venueId);
    }

    public Photo addPhoto(Photo photo) {
        return photoRepository.save(photo);
    }
}
