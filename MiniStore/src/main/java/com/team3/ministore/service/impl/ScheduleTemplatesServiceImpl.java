package com.team3.ministore.service.impl;

import com.team3.ministore.model.ScheduleTemplates;
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
    public List<ScheduleTemplates> getAllScheduleTemplates() {
        return scheduleTemplatesRepository.findAll();
    }

    @Override
    public ScheduleTemplates createScheduleTemplates(ScheduleTemplates scheduleTemplates) {
        return scheduleTemplatesRepository.save(scheduleTemplates);
    }

    @Override
    public ScheduleTemplates getScheduleTemplatesById(Integer id) {
        return scheduleTemplatesRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Schedule Template ID: " + id));
    }

    @Override
    public ScheduleTemplates updateScheduleTemplates(Integer id, ScheduleTemplates scheduleTemplates) {
        ScheduleTemplates existingScheduleTemplates = getScheduleTemplatesById(id);

        existingScheduleTemplates.setName(scheduleTemplates.getName());
        existingScheduleTemplates.setDescription(scheduleTemplates.getDescription());
        existingScheduleTemplates.setNumOfShifts(scheduleTemplates.getNumOfShifts());

        return scheduleTemplatesRepository.save(existingScheduleTemplates);
    }

    @Override
    public void deleteScheduleTemplates(Integer id) {
        scheduleTemplatesRepository.deleteById(id);
    }
}
