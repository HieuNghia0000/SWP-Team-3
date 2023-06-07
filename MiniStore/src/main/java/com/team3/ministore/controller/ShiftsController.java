package com.team3.ministore.controller;

import com.team3.ministore.model.Shifts;
import com.team3.ministore.service.ShiftsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shifts")
public class ShiftsController {

    @Autowired
    private ShiftsService shiftsService;

    @PostMapping("/add")
    public ResponseEntity<Shifts> createShifts(@RequestBody Shifts shifts) {
        Shifts createdShifts = shiftsService.createShifts(shifts);
        return new ResponseEntity<>(createdShifts, HttpStatus.CREATED);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Shifts>> getAllShifts() {
        List<Shifts> shiftsList = shiftsService.getAllShifts();
        return new ResponseEntity<>(shiftsList, HttpStatus.OK);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<Shifts> getShiftsById(@PathVariable("id") Integer id) {
        Shifts shifts = shiftsService.getShiftsById(id);
        return new ResponseEntity<>(shifts, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Shifts> updateShifts(@PathVariable("id") Integer id, @RequestBody Shifts shifts) {
        Shifts updatedShifts = shiftsService.updateShifts(id, shifts);
        return new ResponseEntity<>(updatedShifts, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteShifts(@PathVariable("id") Integer id) {
        shiftsService.deleteShifts(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

