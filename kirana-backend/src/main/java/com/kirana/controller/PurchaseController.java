package com.kirana.controller;

import com.kirana.dto.PurchaseRequest;
import com.kirana.model.Purchase;
import com.kirana.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService service;

    public PurchaseController(PurchaseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Purchase> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Purchase getOne(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Purchase create(@Valid @RequestBody PurchaseRequest r) {
        return service.create(r);
    }
}
