package com.team3.ministore.service;

import com.team3.ministore.model.LeaveRequest;

import java.util.List;

public interface LeaveRequestService {
    List<LeaveRequest> getAllLeaveRequest();

    LeaveRequest createLeaveRequest(LeaveRequest leaveRequest);

    LeaveRequest getLeaveRequestById(Integer id);

    LeaveRequest updateLeaveRequest(Integer id, LeaveRequest leaveRequest);

    void deleteLeaveRequest(Integer id);
}
