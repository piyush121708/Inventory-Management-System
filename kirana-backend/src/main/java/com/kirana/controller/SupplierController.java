package com.kirana.controller;

import com.kirana.model.Supplier;
import com.kirana.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService service;

    public SupplierController(SupplierService service) {
        this.service = service;
    }

    @GetMapping
    public List<Supplier> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Supplier getOne(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Supplier create(@Valid @RequestBody Supplier s) {
        return service.create(s);
    }

    @PutMapping("/{id}")
    public Supplier update(@PathVariable Long id, @Valid @RequestBody Supplier data) {
        return service.update(id, data);
    }

    // Fails with 409 if the supplier already has purchases.
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
