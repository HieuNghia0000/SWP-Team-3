package com.team3.ministore.controller;

import com.team3.ministore.model.TimeOffRequests;
import com.team3.ministore.service.TimeOffRequestsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave-requests")
public class TimeOffRequestsController {

    @Autowired
    private TimeOffRequestsService timeOffRequestsService;

    @PostMapping("/add")
    public ResponseEntity<TimeOffRequests> createTimeOffRequests(@RequestBody TimeOffRequests timeOffRequests) {
        TimeOffRequests createdTimeOffRequests = timeOffRequestsService.createTimeOffRequests(timeOffRequests);
        return new ResponseEntity<>(createdTimeOffRequests, HttpStatus.CREATED);
    }

    @GetMapping("/list")
    public ResponseEntity<List<TimeOffRequests>> getAllTimeOffRequests() {
        List<TimeOffRequests> timeOffRequestsList = timeOffRequestsService.getAllTimeOffRequests();
        return new ResponseEntity<>(timeOffRequestsList, HttpStatus.OK);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<TimeOffRequests> getTimeOffRequestsById(@PathVariable("id") Integer id) {
        TimeOffRequests timeOffRequests = timeOffRequestsService.getTimeOffRequestsById(id);
        return new ResponseEntity<>(timeOffRequests, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TimeOffRequests> updateTimeOffRequests(@PathVariable("id") Integer id, @RequestBody TimeOffRequests timeOffRequests) {
        TimeOffRequests updatedTimeOffRequests = timeOffRequestsService.updateTimeOffRequests(id, timeOffRequests);
        return new ResponseEntity<>(updatedTimeOffRequests, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTimeOffRequests(@PathVariable("id") Integer id) {
        timeOffRequestsService.deleteTimeOffRequests(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
