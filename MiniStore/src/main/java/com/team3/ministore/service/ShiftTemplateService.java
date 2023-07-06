package com.team3.ministore.service;

import com.team3.ministore.dto.CreateShiftTemplateDto;
import com.team3.ministore.model.ShiftTemplate;

import java.util.List;

public interface ShiftTemplateService {
    List<ShiftTemplate> getAllShiftTemplates();

    ShiftTemplate createShiftTemplate(CreateShiftTemplateDto dto);

    ShiftTemplate getShiftTemplatesById(Integer id);

    ShiftTemplate updateShiftTemplates(Integer id, ShiftTemplate shiftTemplate);

    void deleteShiftTemplates(Integer id);
}

