package com.kirana.dto;

import com.kirana.model.PaymentMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record BillRequest(
        @NotNull Long employeeId,
        @NotNull PaymentMode paymentMode,
        BigDecimal discount,
        @NotEmpty @Valid List<Item> items) {

    public record Item(@NotNull Long productId, @Min(1) int quantity) {}
}
