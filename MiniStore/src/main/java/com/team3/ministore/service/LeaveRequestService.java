package com.team3.ministore.service;

import com.team3.ministore.dto.LeaveRequestDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LeaveRequestService {
    List<LeaveRequestDto> getAllLeaveRequest();

    Optional<LeaveRequestDto> createLeaveRequest(LeaveRequestDto leaveRequest);

    List<LeaveRequestDto> getLeaveRequestsByStaffIdAndDates(Integer id, LocalDate startDate, LocalDate endDate);

    Optional<LeaveRequestDto> getLeaveRequestById(Integer id);

    Optional<LeaveRequestDto> updateLeaveRequest(Integer id, LeaveRequestDto dto);

    void deleteLeaveRequest(Integer id);
}
