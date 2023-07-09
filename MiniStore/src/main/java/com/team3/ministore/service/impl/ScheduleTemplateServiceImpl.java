package com.team3.ministore.service.impl;

import com.team3.ministore.model.ScheduleTemplate;
import com.team3.ministore.repository.ScheduleTemplateRepository;
import com.team3.ministore.service.ScheduleTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleTemplateServiceImpl implements ScheduleTemplateService {

    @Autowired
    private ScheduleTemplateRepository scheduleTemplateRepository;

    @Override
    public List<ScheduleTemplate> getAllScheduleTemplates() {
        return scheduleTemplateRepository.findAll();
    }

    @Override
    public ScheduleTemplate createScheduleTemplates(ScheduleTemplate scheduleTemplate) {
        return scheduleTemplateRepository.save(scheduleTemplate);
    }

    @Override
    public ScheduleTemplate getScheduleTemplatesById(Integer id) {
        return scheduleTemplateRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Schedule Template ID: " + id));
    }

    @Override
    public ScheduleTemplate updateScheduleTemplates(Integer id, ScheduleTemplate scheduleTemplate) {
        ScheduleTemplate existingScheduleTemplate = getScheduleTemplatesById(id);

        existingScheduleTemplate.setName(scheduleTemplate.getName());
        existingScheduleTemplate.setDescription(scheduleTemplate.getDescription());
        existingScheduleTemplate.setNumOfShifts(scheduleTemplate.getNumOfShifts());

        return scheduleTemplateRepository.save(existingScheduleTemplate);
    }

    @Override
    public void deleteScheduleTemplates(Integer id) {
        scheduleTemplateRepository.deleteById(id);
    }
}
