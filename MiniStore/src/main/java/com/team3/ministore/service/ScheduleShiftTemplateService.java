package com.team3.ministore.service;

import com.team3.ministore.model.ScheduleShiftTemplate;

import java.util.List;
import java.util.Optional;

public interface ScheduleShiftTemplateService {
    List<ScheduleShiftTemplate> getAllShiftScheduleTemplates();

    ScheduleShiftTemplate createShiftScheduleTemplates(ScheduleShiftTemplate scheduleShiftTemplate);

    Optional<ScheduleShiftTemplate> updateShiftScheduleTemplates(Integer id, ScheduleShiftTemplate scheduleShiftTemplate);

    void deleteShiftScheduleTemplates(Integer id);
}
