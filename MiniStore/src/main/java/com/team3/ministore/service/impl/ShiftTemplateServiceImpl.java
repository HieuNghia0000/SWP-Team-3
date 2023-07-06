package com.team3.ministore.service.impl;

import com.team3.ministore.dto.CreateShiftTemplateDto;
import com.team3.ministore.model.Shift;
import com.team3.ministore.model.ShiftTemplate;
import com.team3.ministore.model.Staff;
import com.team3.ministore.repository.ShiftTemplateRepository;
import com.team3.ministore.service.ShiftTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShiftTemplateServiceImpl implements ShiftTemplateService {

    @Autowired
    private ShiftTemplateRepository shiftTemplateRepository;

    @Override
    public List<ShiftTemplate> getAllShiftTemplates() {
        return shiftTemplateRepository.findAll();
    }

    @Override
    public ShiftTemplate createShiftTemplate(CreateShiftTemplateDto dto) {
        ShiftTemplate sTemplate = new ShiftTemplate();

        sTemplate.setStartTime(dto.getStartTime());
        sTemplate.setEndTime(dto.getEndTime());
        sTemplate.setName(dto.getName());
        sTemplate.setSalaryCoefficient(dto.getSalaryCoefficient());
        sTemplate.setRole(dto.getRole());

        return shiftTemplateRepository.save(sTemplate);
    }

    @Override
    public ShiftTemplate getShiftTemplatesById(Integer id) {
        return shiftTemplateRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Shift Template ID: " + id));
    }

    @Override
    public ShiftTemplate updateShiftTemplates(Integer id, ShiftTemplate shiftTemplate) {
        ShiftTemplate existingShiftTemplate = getShiftTemplatesById(id);

        existingShiftTemplate.setStartTime(shiftTemplate.getStartTime());
        existingShiftTemplate.setEndTime(shiftTemplate.getEndTime());
        existingShiftTemplate.setName(shiftTemplate.getName());
        existingShiftTemplate.setSalaryCoefficient(shiftTemplate.getSalaryCoefficient());
        existingShiftTemplate.setRole(shiftTemplate.getRole());

        return shiftTemplateRepository.save(existingShiftTemplate);
    }

    @Override
    public void deleteShiftTemplates(Integer id) {
        shiftTemplateRepository.deleteById(id);
    }
}
