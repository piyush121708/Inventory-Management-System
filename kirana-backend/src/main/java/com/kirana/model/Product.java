package com.kirana.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String barcode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private String unit;                       // label only: pcs, pack, kg ...

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal sellingPrice;

    @Column(precision = 10, scale = 2)
    private BigDecimal costPrice;

    private int stockQty;                      // current stock (changed only via StockService)
    private int reorderLevel;                  // low-stock when stockQty <= reorderLevel
    private boolean active = true;
}
