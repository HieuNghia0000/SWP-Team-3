package com.team3.ministore.service;

import com.team3.ministore.dto.LeaveRequestDto;
import org.springframework.validation.BindingResult;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LeaveRequestService {

    List<LeaveRequestDto> getAllLeaveRequest(int page, int pageSize);

    List<LeaveRequestDto> getAllLeaveRequest(String search, int page, int pageSize);

    Optional<LeaveRequestDto> createLeaveRequest(LeaveRequestDto leaveRequest);

    List<LeaveRequestDto> getLeaveRequestsByStaffIdAndDates(Integer id, LocalDate startDate, LocalDate endDate);

    Optional<LeaveRequestDto> updateLeaveRequest(Integer id, LeaveRequestDto dto);

    void deleteLeaveRequest(Integer id);

    List<LeaveRequestDto> getLeaveRequestsByStaffId(int staffId, int page, int pageSize);
}
