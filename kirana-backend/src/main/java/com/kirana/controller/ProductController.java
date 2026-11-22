package com.kirana.controller;

import com.kirana.dto.ProductRequest;
import com.kirana.model.Product;
import com.kirana.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // GET /api/products?search=rice
    @GetMapping
    public List<Product> getAll(@RequestParam(required = false) String search) {
        return service.getAll(search);
    }

    @GetMapping("/low-stock")
    public List<Product> lowStock() {
        return service.getLowStock();
    }

    // Used by the billing screen when a barcode is scanned/typed.
    @GetMapping("/barcode/{barcode}")
    public Product byBarcode(@PathVariable String barcode) {
        return service.getByBarcode(barcode);
    }

    @GetMapping("/{id}")
    public Product getOne(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@Valid @RequestBody ProductRequest r) {
        return service.create(r);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody ProductRequest r) {
        return service.update(id, r);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivate(@PathVariable Long id) {
        service.deactivate(id);
    }
}
