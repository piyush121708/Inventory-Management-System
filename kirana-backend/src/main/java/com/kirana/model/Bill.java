package com.kirana.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String billNumber;                 // e.g. BILL-000001

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;                 // cashier who made the bill

    private LocalDateTime billDate;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(precision = 12, scale = 2)
    private BigDecimal discount;

    @Column(precision = 12, scale = 2)
    private BigDecimal netAmount;

    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<BillItem> items = new ArrayList<>();
}
