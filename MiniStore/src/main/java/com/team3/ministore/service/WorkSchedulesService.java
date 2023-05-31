package com.team3.ministore.service;

import com.team3.ministore.model.WorkSchedules;

import java.util.List;

public interface WorkSchedulesService {
    List<WorkSchedules> getAllWorkSchedules();

    WorkSchedules createWorkSchedules(WorkSchedules workSchedules);

    WorkSchedules getWorkSchedulesById(Integer id);

    WorkSchedules updateWorkSchedules(Integer id, WorkSchedules workSchedules);

    void deleteWorkSchedules(Integer id);
}
