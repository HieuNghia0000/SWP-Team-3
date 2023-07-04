package com.team3.ministore.service;

import com.team3.ministore.model.Salary;

import java.util.List;

public interface SalaryService {
    List<Salary> getAllSalary();

    Salary createSalary(Salary salary);

    Salary getSalaryById(Integer id);

    Salary updateSalary(Integer id, Salary salary);

    void deleteSalary(Integer id);
}
