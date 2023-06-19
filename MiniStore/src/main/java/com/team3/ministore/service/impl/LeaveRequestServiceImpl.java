package com.team3.ministore.service.impl;

import com.team3.ministore.model.LeaveRequest;
import com.team3.ministore.repository.LeaveRequestRepository;
import com.team3.ministore.service.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestServiceImpl implements LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Override
    public List<LeaveRequest> getAllLeaveRequest() {
        return leaveRequestRepository.findAll();
    }

    @Override
    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        return leaveRequestRepository.save(leaveRequest);
    }

    @Override
    public LeaveRequest getLeaveRequestById(Integer id) {
        return leaveRequestRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Leave Requests ID: " + id));
    }

    @Override
    public LeaveRequest updateLeaveRequest(Integer id, LeaveRequest leaveRequest) {
        LeaveRequest existingLeaveRequest = getLeaveRequestById(id);

        existingLeaveRequest.setStaff(leaveRequest.getStaff());
        existingLeaveRequest.setAdminReply(leaveRequest.getAdminReply());
        existingLeaveRequest.setLeaveType(leaveRequest.getLeaveType());
        existingLeaveRequest.setReason(leaveRequest.getReason());
        existingLeaveRequest.setStatus(leaveRequest.getStatus());
        existingLeaveRequest.setStartDate(leaveRequest.getStartDate());
        existingLeaveRequest.setEndDate(leaveRequest.getEndDate());

        return leaveRequestRepository.save(existingLeaveRequest);
    }

    @Override
    public void deleteLeaveRequest(Integer id) {
        leaveRequestRepository.deleteById(id);
    }
}
