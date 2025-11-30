package com.foodtrendguide.foodtrendguide.controller;

import com.foodtrendguide.foodtrendguide.entity.User;
import com.foodtrendguide.foodtrendguide.model.BlogPost;
import com.foodtrendguide.foodtrendguide.repository.BlogPostRepository;
import com.foodtrendguide.foodtrendguide.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blog")
@CrossOrigin(origins = "http://localhost:5173")
public class BlogPostController {

    @Autowired private BlogPostRepository blogPostRepository;
    @Autowired private UserRepository userRepository;

    // Tüm yazıları getir (Ana akış için)
    @GetMapping
    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAllByOrderByCreatedAtDesc();
    }

    // Bir kullanıcının yazılarını getir (Profil için)
    @GetMapping("/user/{userId}")
    public List<BlogPost> getUserPosts(@PathVariable Long userId) {
        return blogPostRepository.findByAuthorId(userId);
    }

    // Yeni yazı ekle
    @PostMapping("/{userId}")
    public BlogPost createPost(@PathVariable Long userId, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(userId).orElseThrow();

        BlogPost post = new BlogPost();
        post.setTitle(payload.get("title"));
        post.setContent(payload.get("content"));
        post.setAuthor(user);
        post.setCreatedAt(LocalDateTime.now());

        // Rastgele güzel bir yemek fotosu ata (Eğer yoksa)
        String keyword = payload.get("title").contains("Kahve") ? "coffee" : "food";
        post.setImageUrl("https://loremflickr.com/800/400/" + keyword + "?random=" + System.currentTimeMillis());

        return blogPostRepository.save(post);
    }

    // Yazı sil
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        blogPostRepository.deleteById(id);
    }

    @GetMapping("/{id}")
    public BlogPost getPostById(@PathVariable Long id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Yazı bulunamadı"));
    }
}