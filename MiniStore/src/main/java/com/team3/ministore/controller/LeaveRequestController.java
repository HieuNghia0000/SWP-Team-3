package com.team3.ministore.controller;

import com.team3.ministore.model.LeaveRequest;
import com.team3.ministore.service.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave-requests")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    @PostMapping("/add")
    public ResponseEntity<LeaveRequest> createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        LeaveRequest createdLeaveRequest = leaveRequestService.createLeaveRequest(leaveRequest);
        return new ResponseEntity<>(createdLeaveRequest, HttpStatus.CREATED);
    }

    @GetMapping("/list")
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequest() {
        List<LeaveRequest> leaveRequestList = leaveRequestService.getAllLeaveRequest();
        return new ResponseEntity<>(leaveRequestList, HttpStatus.OK);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<LeaveRequest> getLeaveRequestById(@PathVariable("id") Integer id) {
        LeaveRequest leaveRequest = leaveRequestService.getLeaveRequestById(id);
        return new ResponseEntity<>(leaveRequest, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<LeaveRequest> updateLeaveRequest(@PathVariable("id") Integer id, @RequestBody LeaveRequest leaveRequest) {
        LeaveRequest updatedLeaveRequest = leaveRequestService.updateLeaveRequest(id, leaveRequest);
        return new ResponseEntity<>(updatedLeaveRequest, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteLeaveRequest(@PathVariable("id") Integer id) {
        leaveRequestService.deleteLeaveRequest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
