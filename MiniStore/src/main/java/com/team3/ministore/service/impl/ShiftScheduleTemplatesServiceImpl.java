package com.team3.ministore.service.impl;

import com.team3.ministore.model.ShiftScheduleTemplate;
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
    public List<ShiftScheduleTemplate> getAllShiftScheduleTemplates() {
        return shiftScheduleTemplatesRepository.findAll();
    }

    @Override
    public ShiftScheduleTemplate createShiftScheduleTemplates(ShiftScheduleTemplate shiftScheduleTemplate) {
        return shiftScheduleTemplatesRepository.save(shiftScheduleTemplate);
    }

    @Override
    public ShiftScheduleTemplate getShiftScheduleTemplatesById(Integer id) {
        return shiftScheduleTemplatesRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid ShiftScheduleTemplate ID: " + id));
    }

    @Override
    public ShiftScheduleTemplate updateShiftScheduleTemplates(Integer id, ShiftScheduleTemplate shiftScheduleTemplate) {
        ShiftScheduleTemplate existingShiftScheduleTemplate = getShiftScheduleTemplatesById(id);

        existingShiftScheduleTemplate.setDate(shiftScheduleTemplate.getDate());
        existingShiftScheduleTemplate.setStaffName(shiftScheduleTemplate.getStaffName());

        return shiftScheduleTemplatesRepository.save(existingShiftScheduleTemplate);
    }

    @Override
    public void deleteShiftScheduleTemplates(Integer id) {
        shiftScheduleTemplatesRepository.deleteById(id);
    }
}
