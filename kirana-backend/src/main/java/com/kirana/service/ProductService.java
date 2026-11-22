package com.kirana.service;

import com.kirana.dto.ProductRequest;
import com.kirana.exception.BadRequestException;
import com.kirana.exception.ResourceNotFoundException;
import com.kirana.model.Category;
import com.kirana.model.MovementType;
import com.kirana.model.Product;
import com.kirana.repository.CategoryRepository;
import com.kirana.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;
    private final CategoryRepository categoryRepo;
    private final StockService stockService;

    public ProductService(ProductRepository repo, CategoryRepository categoryRepo, StockService stockService) {
        this.repo = repo;
        this.categoryRepo = categoryRepo;
        this.stockService = stockService;
    }

    public List<Product> getAll(String search) {
        if (search == null || search.isBlank()) return repo.findByActiveTrueOrderByNameAsc();
        return repo.findByActiveTrueAndNameContainingIgnoreCaseOrderByNameAsc(search.trim());
    }

    public Product getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    public Product getByBarcode(String barcode) {
        return repo.findByBarcode(barcode)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("No product with barcode: " + barcode));
    }

    // Used by billing: product must exist and be active.
    public Product getActive(Long id) {
        Product p = getById(id);
        if (!p.isActive()) throw new BadRequestException("Product is inactive: " + p.getName());
        return p;
    }

    public List<Product> getLowStock() {
        return repo.findLowStock();
    }

    @Transactional
    public Product create(ProductRequest r) {
        Product p = new Product();
        apply(p, r);
        p.setStockQty(0);
        p = repo.save(p);
        if (r.openingStock() > 0) {
            stockService.record(p, MovementType.OPENING, r.openingStock(), null, "Opening stock", null);
        }
        return p;
    }

    @Transactional
    public Product update(Long id, ProductRequest r) {
        Product p = getById(id);
        apply(p, r);              // stock is NOT changed here; use purchases / adjustments
        return repo.save(p);
    }

    // Soft delete: old bills and stock history still refer to the product.
    public void deactivate(Long id) {
        Product p = getById(id);
        p.setActive(false);
        repo.save(p);
    }

    private void apply(Product p, ProductRequest r) {
        Category c = categoryRepo.findById(r.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + r.categoryId()));
        String barcode = (r.barcode() == null || r.barcode().isBlank()) ? null : r.barcode().trim();
        if (barcode != null) {
            repo.findByBarcode(barcode).ifPresent(existing -> {
                if (!existing.getId().equals(p.getId())) throw new BadRequestException("Barcode already used: " + barcode);
            });
        }
        p.setName(r.name().trim());
        p.setBarcode(barcode);
        p.setCategory(c);
        p.setUnit(r.unit());
        p.setSellingPrice(r.sellingPrice());
        p.setCostPrice(r.costPrice());
        p.setReorderLevel(r.reorderLevel());
    }
}
