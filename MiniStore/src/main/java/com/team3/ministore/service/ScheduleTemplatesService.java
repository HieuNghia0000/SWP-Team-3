package com.team3.ministore.service;

import com.team3.ministore.model.ScheduleTemplate;

import java.util.List;

public interface ScheduleTemplatesService {
    List<ScheduleTemplate> getAllScheduleTemplates();

    ScheduleTemplate createScheduleTemplates(ScheduleTemplate scheduleTemplate);

    ScheduleTemplate getScheduleTemplatesById(Integer id);

    ScheduleTemplate updateScheduleTemplates(Integer id, ScheduleTemplate scheduleTemplate);

    void deleteScheduleTemplates(Integer id);
}
