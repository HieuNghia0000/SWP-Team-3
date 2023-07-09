package com.team3.ministore.service.impl;

import com.team3.ministore.dto.CreateShiftTemplateDto;
import com.team3.ministore.model.ShiftTemplate;
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
    public Optional<ShiftTemplate> getShiftTemplatesById(Integer id) {
        return shiftTemplateRepository.findById(id);
    }

    @Override
    public Optional<ShiftTemplate> updateShiftTemplates(Integer id, ShiftTemplate shiftTemplate) {
        Optional<ShiftTemplate> existingShiftTemplate = getShiftTemplatesById(id);

        return existingShiftTemplate.map(value -> {
            value.setStartTime(shiftTemplate.getStartTime());
            value.setEndTime(shiftTemplate.getEndTime());
            value.setName(shiftTemplate.getName());
            value.setSalaryCoefficient(shiftTemplate.getSalaryCoefficient());
            value.setRole(shiftTemplate.getRole());
            return shiftTemplateRepository.save(value);
        });
    }

    @Override
    public void deleteShiftTemplates(Integer id) {
        shiftTemplateRepository.deleteById(id);
    }
}
