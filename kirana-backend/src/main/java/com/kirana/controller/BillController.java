package com.kirana.controller;

import com.kirana.dto.BillRequest;
import com.kirana.model.Bill;
import com.kirana.service.BillService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService service;

    public BillController(BillService service) {
        this.service = service;
    }

    // GET /api/bills            -> all bills (latest first)
    // GET /api/bills?date=2026-11-19 -> bills of one day
    @GetMapping
    public List<Bill> getAll(@RequestParam(required = false)
                             @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.getAll(date);
    }

    @GetMapping("/{id}")
    public Bill getOne(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Bill create(@Valid @RequestBody BillRequest r) {
        return service.create(r);
    }
}
