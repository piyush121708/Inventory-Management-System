package com.kirana.service;

import com.kirana.dto.DashboardSummary;
import com.kirana.repository.BillRepository;
import com.kirana.repository.ProductRepository;
import com.kirana.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final BillRepository billRepository;

    public DashboardService(ProductRepository productRepository, SupplierRepository supplierRepository,
                            BillRepository billRepository) {
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
        this.billRepository = billRepository;
    }

    public DashboardSummary summary() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        BigDecimal sales = billRepository.sumNetAmount(start, end);
        return new DashboardSummary(
                productRepository.countByActiveTrue(),
                productRepository.findLowStock().size(),
                supplierRepository.count(),
                billRepository.countByBillDateGreaterThanEqualAndBillDateLessThan(start, end),
                sales == null ? BigDecimal.ZERO : sales);
    }
}
