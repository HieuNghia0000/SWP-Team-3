package com.team3.ministore.service.impl;

import com.team3.ministore.model.ShiftScheduleTemplates;
import com.team3.ministore.repository.ShiftScheduleTemplatesRepository;
import com.team3.ministore.service.ShiftScheduleTemplatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftScheduleTemplatesServiceImpl implements ShiftScheduleTemplatesService {

    @Autowired
    private ShiftScheduleTemplatesRepository shiftScheduleTemplatesRepository;

    @Override
    public List<ShiftScheduleTemplates> getAllShiftScheduleTemplates() {
        return shiftScheduleTemplatesRepository.findAll();
    }

    @Override
    public ShiftScheduleTemplates createShiftScheduleTemplates(ShiftScheduleTemplates shiftScheduleTemplates) {
        return shiftScheduleTemplatesRepository.save(shiftScheduleTemplates);
    }

    @Override
    public ShiftScheduleTemplates getShiftScheduleTemplatesById(Integer id) {
        return shiftScheduleTemplatesRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid ShiftScheduleTemplate ID: " + id));
    }

    @Override
    public ShiftScheduleTemplates updateShiftScheduleTemplates(Integer id, ShiftScheduleTemplates shiftScheduleTemplates) {
        ShiftScheduleTemplates existingShiftScheduleTemplates = getShiftScheduleTemplatesById(id);

        existingShiftScheduleTemplates.setDate(shiftScheduleTemplates.getDate());
        existingShiftScheduleTemplates.setStaffName(shiftScheduleTemplates.getStaffName());

        return shiftScheduleTemplatesRepository.save(existingShiftScheduleTemplates);
    }

    @Override
    public void deleteShiftScheduleTemplates(Integer id) {
        shiftScheduleTemplatesRepository.deleteById(id);
    }
}
