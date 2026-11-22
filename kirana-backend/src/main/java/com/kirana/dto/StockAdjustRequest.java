package com.kirana.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record StockAdjustRequest(
        @NotNull Long productId,
        @NotNull Long employeeId,          // must be a MANAGER
        int quantityChange,                // +ve or -ve (damage, expiry, count correction)
        @NotBlank String note) {
}
