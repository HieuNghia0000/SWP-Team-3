package com.team3.ministore.controller;

import com.team3.ministore.model.Staff;
import com.team3.ministore.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;


    //Create new staff
    @PostMapping("/")
    public ResponseEntity<Staff> createStaff(@RequestBody Staff staff) {
        Staff createdStaff = staffService.createStaff(staff);
        return new ResponseEntity<>(createdStaff, HttpStatus.OK);
    }

    //Read all staff
    @GetMapping("/")
    public ResponseEntity<List<Staff>> getAllStaff() {
        List<Staff> staffList = staffService.getAllStaff();
        return new ResponseEntity<>(staffList, HttpStatus.OK);
    }

    //Read a staff by ID
    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable("id") Integer id) {
        Staff staff = staffService.getStaffById(id);
        return new ResponseEntity<>(staff, HttpStatus.OK);
    }

    //Update an existing staff
    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable("id") Integer id, @RequestBody Staff staff) {
        Staff updatedStaff = staffService.updateStaff(id, staff);
        return new ResponseEntity<>(updatedStaff, HttpStatus.OK);
    }

    //Delete a staff
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Integer id) {
        staffService.deleteStaff(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
