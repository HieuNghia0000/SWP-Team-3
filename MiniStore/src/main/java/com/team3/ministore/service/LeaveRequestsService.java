package com.team3.ministore.service;

import com.team3.ministore.model.LeaveRequests;

import java.util.List;

public interface LeaveRequestsService {
    List<LeaveRequests> getAllLeaveRequests();

    LeaveRequests createLeaveRequests(LeaveRequests leaveRequests);

    LeaveRequests getLeaveRequestsById(Integer id);

    LeaveRequests updateLeaveRequests(Integer id, LeaveRequests leaveRequests);

    void deleteLeaveRequests(Integer id);
}
