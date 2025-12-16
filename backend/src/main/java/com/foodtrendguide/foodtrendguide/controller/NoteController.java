package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.entity.User;
import com.foodtrendguide.foodtrendguide.model.Note;
import com.foodtrendguide.foodtrendguide.repository.NoteRepository;
import com.foodtrendguide.foodtrendguide.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")

public class NoteController {

    @Autowired private NoteRepository noteRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public List<Note> getUserNotes(@PathVariable Long userId) {
        return noteRepository.findByUserId(userId);
    }

    @PostMapping("/{userId}")
    public Note addNote(@PathVariable Long userId, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(userId).orElseThrow();
        Note note = new Note();
        note.setTitle(payload.get("title"));
        note.setContent(payload.get("content"));
        note.setUser(user);
        note.setCreatedAt(LocalDateTime.now());
        return noteRepository.save(note);
    }

    @DeleteMapping("/{noteId}")
    public void deleteNote(@PathVariable Long noteId) {
        noteRepository.deleteById(noteId);
    }
}