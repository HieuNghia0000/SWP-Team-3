package com.team3.ministore.service;

import com.team3.ministore.dto.CreateShiftDto;
import com.team3.ministore.model.Shift;

import java.util.List;
import java.util.Optional;

public interface ShiftService {
    List<Shift> getAllShifts();

    Optional<Shift> createShift(CreateShiftDto shift);

    Shift getShiftsById(Integer id);

    Shift updateShifts(Integer id, Shift shift);

    void deleteShifts(Integer id);
}
