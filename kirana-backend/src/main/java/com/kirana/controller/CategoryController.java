package com.kirana.controller;

import com.kirana.model.Category;
import com.kirana.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<Category> getAll() {
        return service.getAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Category create(@Valid @RequestBody Category c) {
        return service.create(c);
    }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @Valid @RequestBody Category data) {
        return service.update(id, data);
    }

    // Fails with 409 if products still use this category.
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
