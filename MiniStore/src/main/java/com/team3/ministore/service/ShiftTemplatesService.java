package com.team3.ministore.service;

import com.team3.ministore.model.ShiftTemplates;

import java.util.List;

public interface ShiftTemplatesService {
    List<ShiftTemplates> getAllShiftTemplates();

    ShiftTemplates createShiftTemplates(ShiftTemplates shiftTemplates);

    ShiftTemplates getShiftTemplatesById(Integer id);

    ShiftTemplates updateShiftTemplates(Integer id, ShiftTemplates shiftTemplates);

    void deleteShiftTemplates(Integer id);
}

