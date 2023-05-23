package com.team3.ministore.controller;

import com.team3.ministore.model.Staff;
import com.team3.ministore.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/staff")
public class StaffController {
    private final StaffRepository staffRepository;

    @Autowired
    public StaffController(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    //Create new staff
    @PostMapping("/")
    public ResponseEntity<Staff> createStaff(@RequestBody Staff staff) {
        Staff createdStaff = staffRepository.save(staff);
        return new ResponseEntity<>(createdStaff, HttpStatus.CREATED);
    }

    //Read all staff
    @GetMapping("/")
    public ResponseEntity<List<Staff>> getAllStaff(@RequestBody Staff staff) {
        List<Staff> staffList = staffRepository.findAll();
        return new ResponseEntity<>(staffList, HttpStatus.OK);
    }

    //Read a staff by ID
    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable("id") Integer id) {
        Optional<Staff> staff = staffRepository.findById(id);

        return staff.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    //Update an existing staff
    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable("id") Integer id, @RequestBody Staff updatedStaff) {
        Optional<Staff> staff = staffRepository.findById(id);

        return staff.map(value -> {
            updatedStaff.setId(id);
            Staff savedStaff = staffRepository.save(updatedStaff);
            return new ResponseEntity<>(savedStaff, HttpStatus.OK);
            }).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    //Delete a staff
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Integer id) {
        Optional<Staff> staff = staffRepository.findById(id);
        if (staff.isPresent()) {
            staffRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
