package com.kirana.repository;

import com.kirana.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findAllByOrderByBillDateDesc();

    List<Bill> findByBillDateGreaterThanEqualAndBillDateLessThanOrderByBillDateDesc(
            LocalDateTime from, LocalDateTime to);

    long countByBillDateGreaterThanEqualAndBillDateLessThan(LocalDateTime from, LocalDateTime to);

    @Query("select sum(b.netAmount) from Bill b where b.billDate >= :from and b.billDate < :to")
    BigDecimal sumNetAmount(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
