package com.team3.ministore.controller;

import com.team3.ministore.model.LeaveRequests;
import com.team3.ministore.service.LeaveRequestsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave-requests")
public class LeaveRequestsController {

    @Autowired
    private LeaveRequestsService leaveRequestsService;

    @PostMapping("/")
    public ResponseEntity<LeaveRequests> createLeaveRequests(@RequestBody LeaveRequests leaveRequests) {
        LeaveRequests createdLeaveRequests = leaveRequestsService.createLeaveRequests(leaveRequests);
        return new ResponseEntity<>(createdLeaveRequests, HttpStatus.CREATED);
    }

    @GetMapping("/")
    public ResponseEntity<List<LeaveRequests>> getAllLeaveRequests() {
        List<LeaveRequests> leaveRequestsList = leaveRequestsService.getAllLeaveRequests();
        return new ResponseEntity<>(leaveRequestsList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequests> getLeaveRequestsById(@PathVariable("id") Integer id) {
        LeaveRequests leaveRequests = leaveRequestsService.getLeaveRequestsById(id);
        return new ResponseEntity<>(leaveRequests, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveRequests> updateLeaveRequests(@PathVariable("id") Integer id, @RequestBody LeaveRequests leaveRequests) {
        LeaveRequests updatedLeaveRequests = leaveRequestsService.updateLeaveRequests(id, leaveRequests);
        return new ResponseEntity<>(updatedLeaveRequests, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveRequests(@PathVariable("id") Integer id) {
        leaveRequestsService.deleteLeaveRequests(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
