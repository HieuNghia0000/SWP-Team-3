package com.team3.ministore.service;

import com.team3.ministore.model.ScheduleTemplates;

import java.util.List;

public interface ScheduleTemplatesService {
    List<ScheduleTemplates> getAllScheduleTemplates();

    ScheduleTemplates createScheduleTemplates(ScheduleTemplates scheduleTemplates);

    ScheduleTemplates getScheduleTemplatesById(Integer id);

    ScheduleTemplates updateScheduleTemplates(Integer id, ScheduleTemplates scheduleTemplates);

    void deleteScheduleTemplates(Integer id);
}
