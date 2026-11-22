package com.kirana.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

// One row for every change in stock. Never edited or deleted.
@Entity
@Getter
@Setter
public class StockMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType type;

    private int quantityChange;                // +ve = stock in, -ve = stock out
    private int balanceAfter;
    private Long referenceId;                  // bill id / purchase id (null for opening/adjustment)
    private String note;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "performed_by")
    private Employee performedBy;

    private LocalDateTime createdAt;
}
