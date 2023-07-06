package com.team3.ministore.service.impl;

import com.team3.ministore.model.ShiftCoverRequest;
import com.team3.ministore.repository.ShiftCoverRequestRepository;
import com.team3.ministore.service.ShiftCoverRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftCoverRequestServiceImpl implements ShiftCoverRequestService {

    @Autowired
    private ShiftCoverRequestRepository shiftCoverRequestRepository;

    @Override
    public List<ShiftCoverRequest> getAllShiftCoverRequests() {
        return shiftCoverRequestRepository.findAll();
    }

    @Override
    public ShiftCoverRequest createShiftCoverRequest(ShiftCoverRequest shiftCoverRequest) {
        return shiftCoverRequestRepository.save(shiftCoverRequest);
    }

    @Override
    public ShiftCoverRequest getShiftCoverRequestById(Integer id) {
        return shiftCoverRequestRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Shift Cover Request ID: " + id));
    }

    @Override
    public ShiftCoverRequest updateShiftCoverRequest(Integer id, ShiftCoverRequest shiftCoverRequest) {
        ShiftCoverRequest existingShiftCoverRequest = getShiftCoverRequestById(id);

        existingShiftCoverRequest.setStaff(shiftCoverRequest.getStaff());
        existingShiftCoverRequest.setNote(shiftCoverRequest.getNote());
        existingShiftCoverRequest.setStatus(shiftCoverRequest.getStatus());

        return shiftCoverRequestRepository.save(existingShiftCoverRequest);
    }

    @Override
    public void deleteShiftCoverRequest(Integer id) {
        shiftCoverRequestRepository.deleteById(id);
    }
}
