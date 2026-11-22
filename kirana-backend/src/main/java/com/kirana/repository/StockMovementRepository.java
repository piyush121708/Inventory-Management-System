package com.kirana.repository;

import com.kirana.model.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    Page<StockMovement> findAllByOrderByCreatedAtDescIdDesc(Pageable pageable);

    Page<StockMovement> findByProductIdOrderByCreatedAtDescIdDesc(Long productId, Pageable pageable);
}
