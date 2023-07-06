package com.team3.ministore.service;

import com.team3.ministore.model.ShiftScheduleTemplate;

import java.util.List;

public interface ShiftScheduleTemplatesService {
    List<ShiftScheduleTemplate> getAllShiftScheduleTemplates();

    ShiftScheduleTemplate createShiftScheduleTemplates(ShiftScheduleTemplate shiftScheduleTemplate);

    ShiftScheduleTemplate getShiftScheduleTemplatesById(Integer id);

    ShiftScheduleTemplate updateShiftScheduleTemplates(Integer id, ShiftScheduleTemplate shiftScheduleTemplate);

    void deleteShiftScheduleTemplates(Integer id);
}
