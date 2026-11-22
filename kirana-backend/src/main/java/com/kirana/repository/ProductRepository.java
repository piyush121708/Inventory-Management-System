package com.kirana.repository;

import com.kirana.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrueOrderByNameAsc();

    List<Product> findByActiveTrueAndNameContainingIgnoreCaseOrderByNameAsc(String name);

    Optional<Product> findByBarcode(String barcode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Product p where p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);

    @Query("select p from Product p where p.active = true and p.stockQty <= p.reorderLevel order by p.stockQty asc")
    List<Product> findLowStock();

    long countByActiveTrue();
}
