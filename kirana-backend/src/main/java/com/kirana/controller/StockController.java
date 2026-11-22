package com.kirana.controller;

import com.kirana.dto.StockAdjustRequest;
import com.kirana.model.StockMovement;
import com.kirana.service.StockService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService service;

    public StockController(StockService service) {
        this.service = service;
    }

    // GET /api/stock/movements?productId=1&page=0&size=20   (productId optional)
    @GetMapping("/movements")
    public Page<StockMovement> history(@RequestParam(required = false) Long productId,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "20") int size) {
        return service.history(productId, page, size);
    }

    // Manual correction (damaged / expired / stock-count difference). Manager only.
    @PostMapping("/adjust")
    @ResponseStatus(HttpStatus.CREATED)
    public StockMovement adjust(@Valid @RequestBody StockAdjustRequest r) {
        return service.adjust(r);
    }
}
