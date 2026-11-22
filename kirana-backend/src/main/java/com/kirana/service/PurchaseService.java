package com.kirana.service;

import com.kirana.dto.PurchaseRequest;
import com.kirana.exception.ResourceNotFoundException;
import com.kirana.model.*;
import com.kirana.repository.ProductRepository;
import com.kirana.repository.PurchaseRepository;
import com.kirana.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepo;
    private final SupplierRepository supplierRepo;
    private final ProductRepository productRepo;
    private final EmployeeService employeeService;
    private final StockService stockService;

    public PurchaseService(PurchaseRepository purchaseRepo, SupplierRepository supplierRepo,
                           ProductRepository productRepo, EmployeeService employeeService,
                           StockService stockService) {
        this.purchaseRepo = purchaseRepo;
        this.supplierRepo = supplierRepo;
        this.productRepo = productRepo;
        this.employeeService = employeeService;
        this.stockService = stockService;
    }

    public List<Purchase> getAll() {
        return purchaseRepo.findAllByOrderByPurchaseDateDescIdDesc();
    }

    public Purchase getById(Long id) {
        return purchaseRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Purchase not found: " + id));
    }

    // Recording a purchase: saves it, increases stock, updates cost price, writes stock history.
    @Transactional
    public Purchase create(PurchaseRequest r) {
        Employee manager = employeeService.requireManager(r.employeeId());
        Supplier supplier = supplierRepo.findById(r.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + r.supplierId()));

        Purchase purchase = new Purchase();
        purchase.setSupplier(supplier);
        purchase.setCreatedBy(manager);
        purchase.setInvoiceNo(r.invoiceNo());
        purchase.setPurchaseDate(r.purchaseDate() != null ? r.purchaseDate() : LocalDate.now());

        BigDecimal total = BigDecimal.ZERO;
        for (PurchaseRequest.Item i : r.items()) {
            Product p = productRepo.findById(i.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + i.productId()));
            PurchaseItem item = new PurchaseItem();
            item.setPurchase(purchase);
            item.setProduct(p);
            item.setQuantity(i.quantity());
            item.setUnitCost(i.unitCost());
            item.setLineTotal(i.unitCost().multiply(BigDecimal.valueOf(i.quantity())));
            purchase.getItems().add(item);
            total = total.add(item.getLineTotal());
        }
        purchase.setTotalAmount(total);
        purchase = purchaseRepo.save(purchase);

        for (PurchaseItem item : purchase.getItems()) {
            Product p = item.getProduct();
            p.setCostPrice(item.getUnitCost());     // latest purchase cost
            stockService.record(p, MovementType.PURCHASE, item.getQuantity(), purchase.getId(),
                    "Purchase #" + purchase.getId() + " from " + supplier.getName(), manager);
        }
        return purchase;
    }
}
