package com.team3.ministore.controller;

import com.team3.ministore.model.ShiftCoverRequests;
import com.team3.ministore.service.ShiftCoverRequestsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shift-cover-requests")
public class ShiftCoverRequestsController {
    
    @Autowired
    private ShiftCoverRequestsService shiftCoverRequestsService;

    @GetMapping("")
    public ResponseEntity<List<ShiftCoverRequests>> getAllShiftCoverRequests() {
        List<ShiftCoverRequests> shiftCoverRequestsList = shiftCoverRequestsService.getAllShiftCoverRequests();
        return new ResponseEntity<>(shiftCoverRequestsList, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<ShiftCoverRequests> createShiftCoverRequests(@RequestBody ShiftCoverRequests shiftCoverRequests) {
        ShiftCoverRequests createdShiftCoverRequests = shiftCoverRequestsService.createShiftCoverRequests(shiftCoverRequests);
        return new ResponseEntity<>(createdShiftCoverRequests, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ShiftCoverRequests> updateShiftCoverRequests(@PathVariable("id") Integer id, @RequestBody ShiftCoverRequests shiftCoverRequests) {
        ShiftCoverRequests updatedShiftCoverRequests = shiftCoverRequestsService.updateShiftCoverRequests(id, shiftCoverRequests);
        return new ResponseEntity<>(updatedShiftCoverRequests, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteShiftCoverRequests(@PathVariable("id") Integer id) {
        shiftCoverRequestsService.deleteShiftCoverRequests(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
