package com.foodtrendguide.foodtrendguide.service;

import com.foodtrendguide.foodtrendguide.model.Bookmark;
import com.foodtrendguide.foodtrendguide.repository.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    public List<Bookmark> getUserBookmarks(Long userId) {
        return bookmarkRepository.findByUserId(userId);
    }

    public Bookmark addBookmark(Bookmark bookmark) {
        if (bookmark.getUser() == null || bookmark.getUser().getId() == null ||
                bookmark.getVenue() == null || bookmark.getVenue().getId() == null) {
            throw new IllegalArgumentException("User and Venue IDs are required.");
        }

        if (bookmarkRepository.existsByUserIdAndVenueId(
                bookmark.getUser().getId(),
                bookmark.getVenue().getId())
        ) {
            throw new RuntimeException("This venue is already bookmarked by user.");
        }

        return bookmarkRepository.save(bookmark);
    }


    public void removeBookmark(Long id) {
        bookmarkRepository.deleteById(id);
    }
}
