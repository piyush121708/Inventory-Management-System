package com.kirana.config;

import com.kirana.dto.ProductRequest;
import com.kirana.model.*;
import com.kirana.repository.*;
import com.kirana.service.ProductService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

// Inserts sample data on first run so the demo is not empty.
@Component
public class DataSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepo;
    private final CategoryRepository categoryRepo;
    private final SupplierRepository supplierRepo;
    private final ProductService productService;

    public DataSeeder(EmployeeRepository employeeRepo, CategoryRepository categoryRepo,
                      SupplierRepository supplierRepo, ProductService productService) {
        this.employeeRepo = employeeRepo;
        this.categoryRepo = categoryRepo;
        this.supplierRepo = supplierRepo;
        this.productService = productService;
    }

    @Override
    public void run(String... args) {
        if (employeeRepo.count() > 0) return;

        employeeRepo.save(employee("Ramesh Sharma", "9800000001", Role.MANAGER));
        employeeRepo.save(employee("Suresh Kumar", "9800000002", Role.CASHIER));

        Category grocery = category("Grocery");
        Category dairy = category("Dairy");
        Category snacks = category("Snacks");
        Category beverages = category("Beverages");
        category("Household");

        Supplier s = new Supplier();
        s.setName("Gupta Wholesale Traders");
        s.setPhone("9811111111");
        s.setAddress("Main Mandi, Delhi");
        supplierRepo.save(s);

        productService.create(new ProductRequest("Basmati Rice 1kg", "8900000000011", grocery.getId(), "pack",
                bd("110"), bd("92"), 10, 50));
        productService.create(new ProductRequest("Toor Dal 1kg", "8900000000028", grocery.getId(), "pack",
                bd("150"), bd("128"), 10, 40));
        productService.create(new ProductRequest("Amul Milk 500ml", "8900000000035", dairy.getId(), "pcs",
                bd("30"), bd("27"), 20, 60));
        productService.create(new ProductRequest("Lays Classic 50g", "8900000000042", snacks.getId(), "pcs",
                bd("20"), bd("16"), 15, 8));
        productService.create(new ProductRequest("Pepsi 600ml", "8900000000059", beverages.getId(), "pcs",
                bd("40"), bd("33"), 12, 36));
    }

    private Employee employee(String name, String phone, Role role) {
        Employee e = new Employee();
        e.setName(name);
        e.setPhone(phone);
        e.setRole(role);
        e.setActive(true);
        return e;
    }

    private Category category(String name) {
        Category c = new Category();
        c.setName(name);
        return categoryRepo.save(c);
    }

    private BigDecimal bd(String v) {
        return new BigDecimal(v);
    }
}
