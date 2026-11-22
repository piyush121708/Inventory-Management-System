package com.kirana.service;

import com.kirana.exception.ResourceNotFoundException;
import com.kirana.model.Supplier;
import com.kirana.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository repository;

    public SupplierService(SupplierRepository repository) {
        this.repository = repository;
    }

    public List<Supplier> getAll() {
        return repository.findAll();
    }

    public Supplier getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + id));
    }

    public Supplier create(Supplier supplier) {
        supplier.setId(null);
        return repository.save(supplier);
    }

    public Supplier update(Long id, Supplier data) {
        Supplier supplier = getById(id);
        supplier.setName(data.getName());
        supplier.setPhone(data.getPhone());
        supplier.setAddress(data.getAddress());
        return repository.save(supplier);
    }

    public void delete(Long id) {
        repository.delete(getById(id));
    }
}
