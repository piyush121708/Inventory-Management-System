package com.kirana.service;

import com.kirana.model.Bill;
import com.kirana.repository.BillRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class BillServiceTest {

    @Test
    void dateFilterUsesStartInclusiveAndNextDayExclusiveBounds() {
        BillRepository billRepository = mock(BillRepository.class);
        ProductService productService = mock(ProductService.class);
        EmployeeService employeeService = mock(EmployeeService.class);
        StockService stockService = mock(StockService.class);
        BillService service = new BillService(billRepository, productService, employeeService, stockService);
        LocalDate date = LocalDate.of(2026, 11, 21);
        List<Bill> expected = List.of(new Bill());
        when(billRepository.findByBillDateGreaterThanEqualAndBillDateLessThanOrderByBillDateDesc(
                date.atStartOfDay(), date.plusDays(1).atStartOfDay())).thenReturn(expected);

        assertSame(expected, service.getAll(date));
        verify(billRepository).findByBillDateGreaterThanEqualAndBillDateLessThanOrderByBillDateDesc(
                LocalDateTime.of(2026, 11, 21, 0, 0), LocalDateTime.of(2026, 11, 22, 0, 0));
    }
}
