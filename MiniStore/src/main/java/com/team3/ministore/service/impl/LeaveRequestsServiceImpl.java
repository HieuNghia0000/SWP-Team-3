package com.team3.ministore.service.impl;

import com.team3.ministore.model.LeaveRequests;
import com.team3.ministore.repository.LeaveRequestsRepository;
import com.team3.ministore.service.LeaveRequestsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestsServiceImpl implements LeaveRequestsService {

    @Autowired
    private LeaveRequestsRepository leaveRequestsRepository;

    @Override
    public List<LeaveRequests> getAllLeaveRequests() {
        return leaveRequestsRepository.findAll();
    }

    @Override
    public LeaveRequests createLeaveRequests(LeaveRequests leaveRequests) {
        return leaveRequestsRepository.save(leaveRequests);
    }

    @Override
    public LeaveRequests getLeaveRequestsById(Integer id) {
        return leaveRequestsRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Leave Requests ID: " + id));
    }

    @Override
    public LeaveRequests updateLeaveRequests(Integer id, LeaveRequests leaveRequests) {
        LeaveRequests existingLeaveRequests = getLeaveRequestsById(id);

        existingLeaveRequests.setStaff(leaveRequests.getStaff());
        existingLeaveRequests.setAdminReply(leaveRequests.getAdminReply());
        existingLeaveRequests.setComments(leaveRequests.getComments());
        existingLeaveRequests.setStatus(leaveRequests.getStatus());
        existingLeaveRequests.setStartDate(leaveRequests.getStartDate());
        existingLeaveRequests.setEndDate(leaveRequests.getEndDate());

        return leaveRequestsRepository.save(existingLeaveRequests);
    }

    @Override
    public void deleteLeaveRequests(Integer id) {
        leaveRequestsRepository.deleteById(id);
    }
}
