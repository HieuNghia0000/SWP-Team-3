package com.team3.ministore.service.impl;

import com.team3.ministore.model.WorkSchedules;
import com.team3.ministore.repository.WorkSchedulesRepository;
import com.team3.ministore.service.WorkSchedulesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkSchedulesServiceImpl implements WorkSchedulesService {
    
    @Autowired
    private WorkSchedulesRepository workSchedulesRepository;

    @Override
    public List<WorkSchedules> getAllWorkSchedules() {
        return workSchedulesRepository.findAll();
    }

    @Override
    public WorkSchedules createWorkSchedules(WorkSchedules workSchedules) {
        return workSchedulesRepository.save(workSchedules);
    }

    @Override
    public WorkSchedules getWorkSchedulesById(Integer id) {
        return workSchedulesRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Order ID: " + id));
    }

    @Override
    public WorkSchedules updateWorkSchedules(Integer id, WorkSchedules workSchedules) {
        WorkSchedules existingWorkSchedules = getWorkSchedulesById(id);

        existingWorkSchedules.setStaff(workSchedules.getStaff());
        existingWorkSchedules.setShifts(workSchedules.getShifts());
        existingWorkSchedules.setLocation(workSchedules.getLocation());
        existingWorkSchedules.setWorkDate(workSchedules.getWorkDate());
        existingWorkSchedules.setCheckInTime(workSchedules.getCheckInTime());
        existingWorkSchedules.setCheckOutTime(workSchedules.getCheckOutTime());
        existingWorkSchedules.setStatus(workSchedules.getStatus());

        return workSchedulesRepository.save(existingWorkSchedules);
    }

    @Override
    public void deleteWorkSchedules(Integer id) {
        workSchedulesRepository.deleteById(id);
    }
}
