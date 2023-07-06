package com.team3.ministore.service;

import com.team3.ministore.model.ShiftCoverRequest;

import java.util.List;

public interface ShiftCoverRequestService {
    List<ShiftCoverRequest> getAllShiftCoverRequests();

    ShiftCoverRequest createShiftCoverRequest(ShiftCoverRequest shiftCoverRequest);

    ShiftCoverRequest getShiftCoverRequestById(Integer id);

    ShiftCoverRequest updateShiftCoverRequest(Integer id, ShiftCoverRequest shiftCoverRequest);

    void deleteShiftCoverRequest(Integer id);
}
