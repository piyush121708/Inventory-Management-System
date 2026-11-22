package com.kirana.service;

import com.kirana.exception.BadRequestException;
import com.kirana.model.MovementType;
import com.kirana.model.Product;
import com.kirana.repository.ProductRepository;
import com.kirana.repository.StockMovementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class StockServiceTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private StockMovementRepository movementRepository;
    @Mock
    private EmployeeService employeeService;

    private StockService service;

    @BeforeEach
    void setUp() {
        service = new StockService(productRepository, movementRepository, employeeService);
    }

    @Test
    void recordUpdatesQuantityAndCreatesMovement() {
        Product product = new Product();
        product.setId(1L);
        product.setName("Rice");
        product.setStockQty(5);
        when(productRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(product));

        service.record(product, MovementType.PURCHASE, 3, 8L, "Restock", null);

        assertEquals(8, product.getStockQty());
        verify(productRepository).save(product);
        verify(movementRepository).save(any());
    }

    @Test
    void recordRejectsNegativeStockWithoutSaving() {
        Product product = new Product();
        product.setId(1L);
        product.setName("Rice");
        product.setStockQty(2);
        when(productRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(product));

        assertThrows(BadRequestException.class,
                () -> service.record(product, MovementType.SALE, -3, 9L, "Sale", null));

        verify(productRepository, never()).save(any());
        verify(movementRepository, never()).save(any());
    }

    @Test
    void historyRejectsInvalidPageSize() {
        assertThrows(BadRequestException.class, () -> service.history(null, 0, 0));
        assertThrows(BadRequestException.class, () -> service.history(null, -1, 20));
    }
}
