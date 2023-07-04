package com.team3.ministore.controller;

import com.team3.ministore.model.Salary;
import com.team3.ministore.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/salary")
public class SalaryController {

    @Autowired
    private SalaryService salaryService;

    @GetMapping("")
    public ResponseEntity<List<Salary>> getAllSalary() {
        List<Salary> salaryList = salaryService.getAllSalary();
        return new ResponseEntity<>(salaryList, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Salary> createSalary(@RequestBody Salary salary) {
        Salary createdSalary = salaryService.createSalary(salary);
        return new ResponseEntity<>(createdSalary, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Salary> updateSalary(@PathVariable("id") Integer id, @RequestBody Salary salary) {
        Salary updatedSalary = salaryService.updateSalary(id, salary);
        return new ResponseEntity<>(updatedSalary, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSalary(@PathVariable("id") Integer id) {
        salaryService.deleteSalary(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
