package com.team3.ministore.service.impl;

import com.team3.ministore.model.ShiftCoverRequests;
import com.team3.ministore.repository.ShiftCoverRequestsRepository;
import com.team3.ministore.service.ShiftCoverRequestsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftCoverRequestsServiceImpl implements ShiftCoverRequestsService {

    @Autowired
    private ShiftCoverRequestsRepository shiftCoverRequestsRepository;

    @Override
    public List<ShiftCoverRequests> getAllShiftCoverRequests() {
        return shiftCoverRequestsRepository.findAll();
    }

    @Override
    public ShiftCoverRequests createShiftCoverRequests(ShiftCoverRequests shiftCoverRequests) {
        return shiftCoverRequestsRepository.save(shiftCoverRequests);
    }

    @Override
    public ShiftCoverRequests getShiftCoverRequestsById(Integer id) {
        return shiftCoverRequestsRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Shift Cover Request ID: " + id));
    }

    @Override
    public ShiftCoverRequests updateShiftCoverRequests(Integer id, ShiftCoverRequests shiftCoverRequests) {
        ShiftCoverRequests existingShiftCoverRequests = getShiftCoverRequestsById(id);

        existingShiftCoverRequests.setShift(shiftCoverRequests.getShift());
        existingShiftCoverRequests.setStaff(shiftCoverRequests.getStaff());
        existingShiftCoverRequests.setNote(shiftCoverRequests.getNote());
        existingShiftCoverRequests.setStatus(shiftCoverRequests.getStatus());

        return shiftCoverRequestsRepository.save(existingShiftCoverRequests);
    }

    @Override
    public void deleteShiftCoverRequests(Integer id) {
        shiftCoverRequestsRepository.deleteById(id);
    }
}
