package com.team3.ministore.controller;

import com.team3.ministore.model.ShiftCoverRequest;
import com.team3.ministore.service.ShiftCoverRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shift-cover-requests")
public class ShiftCoverRequestController {
    
    @Autowired
    private ShiftCoverRequestService shiftCoverRequestService;

    @GetMapping("")
    public ResponseEntity<List<ShiftCoverRequest>> getAllShiftCoverRequests() {
        List<ShiftCoverRequest> shiftCoverRequestList = shiftCoverRequestService.getAllShiftCoverRequests();
        return new ResponseEntity<>(shiftCoverRequestList, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<ShiftCoverRequest> createShiftCoverRequests(@RequestBody ShiftCoverRequest shiftCoverRequest) {
        ShiftCoverRequest createdShiftCoverRequest = shiftCoverRequestService.createShiftCoverRequest(shiftCoverRequest);
        return new ResponseEntity<>(createdShiftCoverRequest, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ShiftCoverRequest> updateShiftCoverRequests(@PathVariable("id") Integer id, @RequestBody ShiftCoverRequest shiftCoverRequest) {
        ShiftCoverRequest updatedShiftCoverRequest = shiftCoverRequestService.updateShiftCoverRequest(id, shiftCoverRequest);
        return new ResponseEntity<>(updatedShiftCoverRequest, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteShiftCoverRequests(@PathVariable("id") Integer id) {
        shiftCoverRequestService.deleteShiftCoverRequest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
