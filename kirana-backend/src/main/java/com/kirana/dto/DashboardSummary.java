package com.kirana.dto;

import java.math.BigDecimal;

public record DashboardSummary(
        long totalProducts,
        long lowStockCount,
        long totalSuppliers,
        long todayBills,
        BigDecimal todaySales) {
}
