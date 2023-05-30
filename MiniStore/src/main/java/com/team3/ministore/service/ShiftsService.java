package com.team3.ministore.service;

import com.team3.ministore.model.Shifts;

import java.util.List;

public interface ShiftsService {
    List<Shifts> getAllShifts();

    Shifts createShifts(Shifts shifts);

    Shifts getShiftsById(Integer id);

    Shifts updateShifts(Integer id, Shifts shifts);

    void deleteShifts(Integer id);
}
