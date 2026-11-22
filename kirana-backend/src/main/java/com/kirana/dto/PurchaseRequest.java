package com.kirana.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PurchaseRequest(
        @NotNull Long supplierId,
        @NotNull Long employeeId,          // must be a MANAGER
        String invoiceNo,
        LocalDate purchaseDate,            // defaults to today
        @NotEmpty @Valid List<Item> items) {

    public record Item(
            @NotNull Long productId,
            @Min(1) int quantity,
            @NotNull @DecimalMin("0.01") BigDecimal unitCost) {}
}
