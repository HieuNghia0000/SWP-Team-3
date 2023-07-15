package com.team3.ministore.service;

import com.team3.ministore.dto.ShiftCoverDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ShiftCoverRequestService {
    List<ShiftCoverDto> getAllShiftCoverRequests(String search, Integer page, Integer pageSize);

    List<ShiftCoverDto> getAllShiftCoverRequests(Integer page, Integer pageSize);

    Optional<ShiftCoverDto> createShiftCoverRequest(ShiftCoverDto dto);

    Optional<ShiftCoverDto> updateShiftCoverRequest(Integer id, ShiftCoverDto dto);

    void deleteShiftCoverRequest(Integer id);

    List<ShiftCoverDto> getShiftCoverRequestsByStaffId(Integer id, LocalDate from, LocalDate to);
}
