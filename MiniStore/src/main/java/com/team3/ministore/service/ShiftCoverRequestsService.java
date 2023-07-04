package com.team3.ministore.service;

import com.team3.ministore.model.ShiftCoverRequests;

import java.util.List;

public interface ShiftCoverRequestsService {
    List<ShiftCoverRequests> getAllShiftCoverRequests();

    ShiftCoverRequests createShiftCoverRequests(ShiftCoverRequests shiftCoverRequests);

    ShiftCoverRequests getShiftCoverRequestsById(Integer id);

    ShiftCoverRequests updateShiftCoverRequests(Integer id, ShiftCoverRequests shiftCoverRequests);

    void deleteShiftCoverRequests(Integer id);
}
