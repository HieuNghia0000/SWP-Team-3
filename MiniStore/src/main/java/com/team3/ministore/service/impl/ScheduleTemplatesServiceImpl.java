package com.team3.ministore.service.impl;

import com.team3.ministore.model.ScheduleTemplate;
import com.team3.ministore.repository.ScheduleTemplatesRepository;
import com.team3.ministore.service.ScheduleTemplatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleTemplatesServiceImpl implements ScheduleTemplatesService {

    @Autowired
    private ScheduleTemplatesRepository scheduleTemplatesRepository;

    @Override
    public List<ScheduleTemplate> getAllScheduleTemplates() {
        return scheduleTemplatesRepository.findAll();
    }

    @Override
    public ScheduleTemplate createScheduleTemplates(ScheduleTemplate scheduleTemplate) {
        return scheduleTemplatesRepository.save(scheduleTemplate);
    }

    @Override
    public ScheduleTemplate getScheduleTemplatesById(Integer id) {
        return scheduleTemplatesRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Schedule Template ID: " + id));
    }

    @Override
    public ScheduleTemplate updateScheduleTemplates(Integer id, ScheduleTemplate scheduleTemplate) {
        ScheduleTemplate existingScheduleTemplate = getScheduleTemplatesById(id);

        existingScheduleTemplate.setName(scheduleTemplate.getName());
        existingScheduleTemplate.setDescription(scheduleTemplate.getDescription());
        existingScheduleTemplate.setNumOfShifts(scheduleTemplate.getNumOfShifts());

        return scheduleTemplatesRepository.save(existingScheduleTemplate);
    }

    @Override
    public void deleteScheduleTemplates(Integer id) {
        scheduleTemplatesRepository.deleteById(id);
    }
}
