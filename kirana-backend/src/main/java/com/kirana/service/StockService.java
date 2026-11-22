package com.kirana.service;

import com.kirana.dto.StockAdjustRequest;
import com.kirana.exception.BadRequestException;
import com.kirana.exception.ResourceNotFoundException;
import com.kirana.model.Employee;
import com.kirana.model.MovementType;
import com.kirana.model.Product;
import com.kirana.model.StockMovement;
import com.kirana.repository.ProductRepository;
import com.kirana.repository.StockMovementRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

// The ONLY place where product stock is changed. Every change writes a StockMovement row.
@Service
public class StockService {

    private final ProductRepository productRepo;
    private final StockMovementRepository movementRepo;
    private final EmployeeService employeeService;

    public StockService(ProductRepository productRepo, StockMovementRepository movementRepo,
                        EmployeeService employeeService) {
        this.productRepo = productRepo;
        this.movementRepo = movementRepo;
        this.employeeService = employeeService;
    }

    @Transactional
    public StockMovement record(Product product, MovementType type, int change,
                                Long referenceId, String note, Employee by) {
        Product lockedProduct = productRepo.findByIdForUpdate(product.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + product.getId()));
        int newQty = lockedProduct.getStockQty() + change;
        if (newQty < 0) {
            throw new BadRequestException("Insufficient stock for '" + lockedProduct.getName()
                    + "' (available " + lockedProduct.getStockQty() + ")");
        }
        lockedProduct.setStockQty(newQty);
        productRepo.save(lockedProduct);

        StockMovement m = new StockMovement();
        m.setProduct(lockedProduct);
        m.setType(type);
        m.setQuantityChange(change);
        m.setBalanceAfter(newQty);
        m.setReferenceId(referenceId);
        m.setNote(note);
        m.setPerformedBy(by);
        m.setCreatedAt(LocalDateTime.now());
        return movementRepo.save(m);
    }

    @Transactional
    public StockMovement adjust(StockAdjustRequest r) {
        if (r.quantityChange() == 0) throw new BadRequestException("quantityChange cannot be 0");
        Employee manager = employeeService.requireManager(r.employeeId());
        Product p = productRepo.findById(r.productId())
                .orElseThrow(() -> new com.kirana.exception.ResourceNotFoundException("Product not found: " + r.productId()));
        return record(p, MovementType.ADJUSTMENT, r.quantityChange(), null, r.note(), manager);
    }

    public Page<StockMovement> history(Long productId, int page, int size) {
        if (page < 0) throw new BadRequestException("page must be 0 or greater");
        if (size < 1 || size > 100) throw new BadRequestException("size must be between 1 and 100");
        PageRequest pr = PageRequest.of(page, size);
        if (productId == null) return movementRepo.findAllByOrderByCreatedAtDescIdDesc(pr);
        return movementRepo.findByProductIdOrderByCreatedAtDescIdDesc(productId, pr);
    }
}
