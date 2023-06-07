package com.team3.ministore.controller;

import com.team3.ministore.model.Staff;
import com.team3.ministore.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    @PostMapping("/add")
    public ResponseEntity<Staff> createStaff(@RequestBody Staff staff) {
        Staff createdStaff = staffService.createStaff(staff);
        return new ResponseEntity<>(createdStaff, HttpStatus.OK);
    }

    //Read all staff
    @GetMapping("/list")
    public ResponseEntity<List<Staff>> getAllStaff() {
        List<Staff> staffList = staffService.getAllStaff();
        return new ResponseEntity<>(staffList, HttpStatus.OK);
    }

    //Read a staff by ID
    @GetMapping("/search/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable("id") Integer id) {
        Staff staff = staffService.getStaffById(id);
        return new ResponseEntity<>(staff, HttpStatus.OK);
    }

    //Read a staff by staff name
    @GetMapping("/search/{name}")
    public ResponseEntity<List<Staff>> getStaffByNameLike(@PathVariable("name") String name) {
        List<Staff> staffList = staffService.getStaffByNameLike(name);
        return new ResponseEntity<>(staffList, HttpStatus.OK);
    }

    //Update an existing staff
    @PutMapping("/update/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable("id") Integer id, @RequestBody Staff staff) {
        Staff updatedStaff = staffService.updateStaff(id, staff);
        return new ResponseEntity<>(updatedStaff, HttpStatus.OK);
    }

    //Delete a staff
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Integer id) {
        staffService.deleteStaff(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/paging/{pageIndex}/{pageSize}")
    @ResponseBody
    public ResponseEntity<Page<Staff>> paging(@PathVariable int pageIndex, @PathVariable int pageSize) {
        Page<Staff> staff = staffService.findAllPagingStaff(pageIndex - 1, pageSize);
        if (staff.getSize() == 0) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<Page<Staff>>(staff, HttpStatus.OK);
    }
}
