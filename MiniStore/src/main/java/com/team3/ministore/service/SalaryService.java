package com.team3.ministore.service;

import com.team3.ministore.dto.SalaryDto;
import com.team3.ministore.model.Salary;
import com.team3.ministore.model.Staff;

import java.util.List;

public interface SalaryService {
    List<Salary> getAllSalary();

    SalaryDto getSalaryByStaffId(Integer staffId);

    Salary createSalary(SalaryDto salary, Staff staff);

    Salary getSalaryById(Integer id);

    Salary updateSalary(Integer id, Salary salary);

    void deleteSalary(Integer id);
}
