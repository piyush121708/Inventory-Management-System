package com.kirana.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by")
    private Employee createdBy;

    private String invoiceNo;
    private LocalDate purchaseDate;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<PurchaseItem> items = new ArrayList<>();
}
