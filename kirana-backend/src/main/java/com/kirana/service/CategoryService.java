package com.kirana.service;

import com.kirana.exception.ResourceNotFoundException;
import com.kirana.model.Category;
import com.kirana.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public List<Category> getAll() {
        return repository.findAll();
    }

    public Category create(Category category) {
        category.setId(null);
        return repository.save(category);
    }

    public Category update(Long id, Category data) {
        Category category = getById(id);
        category.setName(data.getName());
        return repository.save(category);
    }

    public void delete(Long id) {
        repository.delete(getById(id));
    }

    private Category getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }
}
