package com.kirana.service;

import com.kirana.dto.BillRequest;
import com.kirana.exception.BadRequestException;
import com.kirana.exception.ResourceNotFoundException;
import com.kirana.model.*;
import com.kirana.repository.BillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BillService {

    private final BillRepository billRepo;
    private final ProductService productService;
    private final EmployeeService employeeService;
    private final StockService stockService;

    public BillService(BillRepository billRepo, ProductService productService,
                       EmployeeService employeeService, StockService stockService) {
        this.billRepo = billRepo;
        this.productService = productService;
        this.employeeService = employeeService;
        this.stockService = stockService;
    }

    public List<Bill> getAll(LocalDate date) {
        if (date == null) return billRepo.findAllByOrderByBillDateDesc();
        return billRepo.findByBillDateGreaterThanEqualAndBillDateLessThanOrderByBillDateDesc(
                date.atStartOfDay(), date.plusDays(1).atStartOfDay());
    }

    public Bill getById(Long id) {
        return billRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Bill not found: " + id));
    }

    // Billing: prices come from the product table (not from the client), stock is reduced, history written.
    @Transactional
    public Bill create(BillRequest r) {
        Employee employee = employeeService.requireActive(r.employeeId());

        Bill bill = new Bill();
        bill.setEmployee(employee);
        bill.setPaymentMode(r.paymentMode());
        bill.setBillDate(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        for (BillRequest.Item i : r.items()) {
            Product p = productService.getActive(i.productId());
            BillItem item = new BillItem();
            item.setBill(bill);
            item.setProduct(p);
            item.setQuantity(i.quantity());
            item.setUnitPrice(p.getSellingPrice());
            item.setLineTotal(p.getSellingPrice().multiply(BigDecimal.valueOf(i.quantity())));
            bill.getItems().add(item);
            total = total.add(item.getLineTotal());
        }

        BigDecimal discount = r.discount() == null ? BigDecimal.ZERO : r.discount();
        if (discount.signum() < 0 || discount.compareTo(total) > 0) {
            throw new BadRequestException("Discount must be between 0 and the bill total (" + total + ")");
        }
        bill.setTotalAmount(total);
        bill.setDiscount(discount);
        bill.setNetAmount(total.subtract(discount));

        bill = billRepo.save(bill);
        bill.setBillNumber(String.format("BILL-%06d", bill.getId()));

        // Reduce stock. If any item is short, the exception rolls back the whole bill.
        for (BillItem item : bill.getItems()) {
            stockService.record(item.getProduct(), MovementType.SALE, -item.getQuantity(),
                    bill.getId(), "Sale " + bill.getBillNumber(), employee);
        }
        return billRepo.save(bill);
    }
}
