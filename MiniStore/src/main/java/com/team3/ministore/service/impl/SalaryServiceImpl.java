package com.team3.ministore.service.impl;

import com.team3.ministore.model.Salary;
import com.team3.ministore.repository.SalaryRepository;
import com.team3.ministore.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalaryServiceImpl implements SalaryService {
    
    @Autowired
    private SalaryRepository salaryRepository;
    
    @Override
    public List<Salary> getAllSalary() {
        return salaryRepository.findAll();
    }

    @Override
    public Salary createSalary(Salary salary) {
        return salaryRepository.save(salary);
    }

    @Override
    public Salary getSalaryById(Integer id) {
        return salaryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Salary ID: " + id));
    }

    @Override
    public Salary updateSalary(Integer id, Salary salary) {
        Salary existingSalary = getSalaryById(id);

        existingSalary.setStaff(salary.getStaff());
        existingSalary.setHourlyWage(salary.getHourlyWage());
        existingSalary.setEffectiveDate(salary.getEffectiveDate());
        existingSalary.setTerminationDate(salary.getTerminationDate());

        return salaryRepository.save(existingSalary);
    }

    @Override
    public void deleteSalary(Integer id) {
        salaryRepository.deleteById(id);
    }
}
