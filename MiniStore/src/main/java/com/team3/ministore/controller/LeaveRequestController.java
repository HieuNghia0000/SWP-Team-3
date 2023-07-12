package com.team3.ministore.controller;

import com.team3.ministore.common.responsehandler.ResponseHandler;
import com.team3.ministore.dto.LeaveRequestDto;
import com.team3.ministore.service.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/leave-requests")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    @PostMapping("/add")
    public ResponseEntity<Object> createLeaveRequest(@Valid @RequestBody LeaveRequestDto leaveRequest, BindingResult errors) {
        if (errors.hasErrors()) return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);

        Optional<LeaveRequestDto> createdLeaveRequest = leaveRequestService.createLeaveRequest(leaveRequest);

        return createdLeaveRequest.map(value -> ResponseHandler.getResponse(value, HttpStatus.CREATED))
                .orElseGet(() -> ResponseHandler.getResponse(new Exception("Invalid staff id"),
                        HttpStatus.BAD_REQUEST));
    }

    @GetMapping("/list")
    public ResponseEntity<Object> getAllLeaveRequest() {
        return ResponseHandler.getResponse(leaveRequestService.getAllLeaveRequest(), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateLeaveRequest(@Valid @PathVariable("id") Integer id,
                                                     @RequestBody LeaveRequestDto dto, BindingResult errors) {
        if (errors.hasErrors()) return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);
        Optional<LeaveRequestDto> updatedLeaveRequest = leaveRequestService.updateLeaveRequest(id, dto);

        return updatedLeaveRequest.map(value -> ResponseHandler.getResponse(value, HttpStatus.OK))
                .orElseGet(() -> ResponseHandler.getResponse(new Exception("Invalid staff id or leave request id"),
                        HttpStatus.BAD_REQUEST));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteLeaveRequest(@PathVariable("id") Integer id) {
        leaveRequestService.deleteLeaveRequest(id);
        return ResponseHandler.getResponse(HttpStatus.OK);
    }
}
