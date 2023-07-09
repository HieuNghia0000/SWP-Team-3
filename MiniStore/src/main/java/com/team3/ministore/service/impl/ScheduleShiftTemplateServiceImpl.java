package com.team3.ministore.service.impl;

import com.team3.ministore.model.ScheduleShiftTemplate;
import com.team3.ministore.repository.ScheduleShiftTemplateRepository;
import com.team3.ministore.service.ScheduleShiftTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScheduleShiftTemplateServiceImpl implements ScheduleShiftTemplateService {

    @Autowired
    private ScheduleShiftTemplateRepository scheduleShiftTemplateRepository;

    @Override
    public List<ScheduleShiftTemplate> getAllShiftScheduleTemplates() {
        return scheduleShiftTemplateRepository.findAll();
    }

    @Override
    public ScheduleShiftTemplate createShiftScheduleTemplates(ScheduleShiftTemplate scheduleShiftTemplate) {
        return scheduleShiftTemplateRepository.save(scheduleShiftTemplate);
    }

    @Override
    public Optional<ScheduleShiftTemplate> updateShiftScheduleTemplates(Integer id, ScheduleShiftTemplate scheduleShiftTemplate) {
        Optional<ScheduleShiftTemplate> existingScheduleShiftTemplate = scheduleShiftTemplateRepository.findById(id);

        return existingScheduleShiftTemplate.map(value-> {
            value.setDate(scheduleShiftTemplate.getDate());
            value.setStartTime(scheduleShiftTemplate.getStartTime());
            value.setEndTime(scheduleShiftTemplate.getEndTime());
            value.setRole(scheduleShiftTemplate.getRole());
            value.setSalaryCoefficient(scheduleShiftTemplate.getSalaryCoefficient());
            value.setScheduleTemplateId(scheduleShiftTemplate.getScheduleTemplateId());
            value.setStaff(scheduleShiftTemplate.getStaff());
            return scheduleShiftTemplateRepository.save(value);
        });
    }

    @Override
    public void deleteShiftScheduleTemplates(Integer id) {
        scheduleShiftTemplateRepository.deleteById(id);
    }
}
