package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.model.Bookmark;
import com.foodtrendguide.foodtrendguide.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @GetMapping("/user/{userId}")
    public List<Bookmark> getUserBookmarks(@PathVariable Long userId) {
        return bookmarkService.getUserBookmarks(userId);
    }

    @PostMapping
    public Bookmark addBookmark(@RequestBody Bookmark bookmark) {
        return bookmarkService.addBookmark(bookmark);
    }

    @DeleteMapping("/{id}")
    public void deleteBookmark(@PathVariable Long id) {
        bookmarkService.removeBookmark(id);
    }
}
