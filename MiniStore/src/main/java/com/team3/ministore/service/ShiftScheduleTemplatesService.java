package com.team3.ministore.service;

import com.team3.ministore.model.ShiftScheduleTemplates;

import java.util.List;

public interface ShiftScheduleTemplatesService {
    List<ShiftScheduleTemplates> getAllShiftScheduleTemplates();

    ShiftScheduleTemplates createShiftScheduleTemplates(ShiftScheduleTemplates shiftScheduleTemplates);

    ShiftScheduleTemplates getShiftScheduleTemplatesById(Integer id);

    ShiftScheduleTemplates updateShiftScheduleTemplates(Integer id, ShiftScheduleTemplates shiftScheduleTemplates);

    void deleteShiftScheduleTemplates(Integer id);
}
