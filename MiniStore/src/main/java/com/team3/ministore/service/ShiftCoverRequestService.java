package com.team3.ministore.service;

import com.team3.ministore.dto.ShiftCoverDto;
import org.springframework.validation.BindingResult;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ShiftCoverRequestService {
    List<ShiftCoverDto> getAllShiftCoverRequests(String search, Integer page, Integer pageSize);

    List<ShiftCoverDto> getAllShiftCoverRequests(Integer page, Integer pageSize);

    Optional<ShiftCoverDto> createShiftCoverRequest(ShiftCoverDto dto);

    Optional<ShiftCoverDto> updateShiftCoverRequest(Integer id, ShiftCoverDto dto);

    void deleteShiftCoverRequest(Integer id);

    List<ShiftCoverDto> getShiftCoverRequestsByStaffIdAndDates(Integer id, LocalDate from, LocalDate to);

    List<ShiftCoverDto> getShiftCoverRequestsByStaffId(Integer staffId, Integer page, Integer pageSize);
}
