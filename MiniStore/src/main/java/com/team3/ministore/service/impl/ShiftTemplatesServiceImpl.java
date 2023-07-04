package com.team3.ministore.service.impl;

import com.team3.ministore.model.ShiftTemplates;
import com.team3.ministore.repository.ShiftTemplatesRepository;
import com.team3.ministore.service.ShiftTemplatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftTemplatesServiceImpl implements ShiftTemplatesService {

    @Autowired
    private ShiftTemplatesRepository shiftTemplatesRepository;

    @Override
    public List<ShiftTemplates> getAllShiftTemplates() {
        return shiftTemplatesRepository.findAll();
    }

    @Override
    public ShiftTemplates createShiftTemplates(ShiftTemplates shiftTemplates) {
        return shiftTemplatesRepository.save(shiftTemplates);
    }

    @Override
    public ShiftTemplates getShiftTemplatesById(Integer id) {
        return shiftTemplatesRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Shift Template ID: " + id));
    }

    @Override
    public ShiftTemplates updateShiftTemplates(Integer id, ShiftTemplates shiftTemplates) {
        ShiftTemplates existingShiftTemplates = getShiftTemplatesById(id);

        existingShiftTemplates.setStartTime(shiftTemplates.getStartTime());
        existingShiftTemplates.setEndTime(shiftTemplates.getEndTime());
        existingShiftTemplates.setName(shiftTemplates.getName());
        existingShiftTemplates.setSalaryCoefficient(shiftTemplates.getSalaryCoefficient());
        existingShiftTemplates.setRole(shiftTemplates.getRole());

        return shiftTemplatesRepository.save(existingShiftTemplates);
    }

    @Override
    public void deleteShiftTemplates(Integer id) {
        shiftTemplatesRepository.deleteById(id);
    }
}
