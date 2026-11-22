package com.kirana.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank String name,
        String barcode,
        @NotNull Long categoryId,
        String unit,
        @NotNull @DecimalMin("0.01") BigDecimal sellingPrice,
        BigDecimal costPrice,
        @Min(0) int reorderLevel,
        @Min(0) int openingStock) {   // used only when creating a product
}
