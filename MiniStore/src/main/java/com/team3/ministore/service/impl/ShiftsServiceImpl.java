package com.team3.ministore.service.impl;

import com.team3.ministore.model.Shifts;
import com.team3.ministore.repository.ShiftsRepository;
import com.team3.ministore.service.ShiftsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftsServiceImpl implements ShiftsService {
    
    @Autowired
    private ShiftsRepository shiftsRepository;

    @Override
    public List<Shifts> getAllShifts() {
        return shiftsRepository.findAll();
    }

    @Override
    public Shifts createShifts(Shifts shifts) {
        return shiftsRepository.save(shifts);
    }

    @Override
    public Shifts getShiftsById(Integer id) {
        return shiftsRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Shifts ID: " + id));
    }

    @Override
    public Shifts updateShifts(Integer id, Shifts shifts) {
        Shifts existingShifts = getShiftsById(id);

        existingShifts.setStaff(shifts.getStaff());
        existingShifts.setDate(shifts.getDate());
        existingShifts.setPublished(shifts.getPublished());

        return shiftsRepository.save(existingShifts);
    }

    @Override
    public void deleteShifts(Integer id) {
        shiftsRepository.deleteById(id);
    }
}
