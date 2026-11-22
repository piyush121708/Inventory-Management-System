package com.kirana.service;

import com.kirana.exception.BadRequestException;
import com.kirana.exception.ResourceNotFoundException;
import com.kirana.model.Employee;
import com.kirana.model.Role;
import com.kirana.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repo;

    public EmployeeService(EmployeeRepository repo) {
        this.repo = repo;
    }

    public List<Employee> getAll() {
        return repo.findAll();
    }

    public Employee getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
    }

    public Employee create(Employee e) {
        e.setId(null);
        return repo.save(e);
    }

    public Employee update(Long id, Employee data) {
        Employee e = getById(id);
        e.setName(data.getName());
        e.setPhone(data.getPhone());
        e.setRole(data.getRole());
        e.setActive(data.isActive());
        return repo.save(e);
    }

    // Employees are never hard-deleted because bills refer to them.
    public void deactivate(Long id) {
        Employee e = getById(id);
        e.setActive(false);
        repo.save(e);
    }

    // Simple role rules (no login): the caller sends employeeId, we check the role.
    public Employee requireActive(Long id) {
        Employee e = getById(id);
        if (!e.isActive()) throw new BadRequestException("Employee is inactive: " + e.getName());
        return e;
    }

    public Employee requireManager(Long id) {
        Employee e = requireActive(id);
        if (e.getRole() != Role.MANAGER) throw new BadRequestException("Only a MANAGER can perform this action");
        return e;
    }
}
