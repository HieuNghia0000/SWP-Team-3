package com.team3.ministore.controller;

import com.team3.ministore.model.WorkSchedules;
import com.team3.ministore.service.WorkSchedulesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/work-schedules")
public class WorkSchedulesController {

    @Autowired
    private WorkSchedulesService workSchedulesService;

    @PostMapping("/")
    public ResponseEntity<WorkSchedules> createWorkSchedules(@RequestBody WorkSchedules workSchedules) {
        WorkSchedules createdWorkSchedules = workSchedulesService.createWorkSchedules(workSchedules);
        return new ResponseEntity<>(createdWorkSchedules, HttpStatus.CREATED);
    }

    @GetMapping("/")
    public ResponseEntity<List<WorkSchedules>> getAllWorkSchedules() {
        List<WorkSchedules> workSchedulesList = workSchedulesService.getAllWorkSchedules();
        return new ResponseEntity<>(workSchedulesList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkSchedules> getWorkSchedulesById(@PathVariable("id") Integer id) {
        WorkSchedules workSchedules = workSchedulesService.getWorkSchedulesById(id);
        return new ResponseEntity<>(workSchedules, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkSchedules> updateWorkSchedules(@PathVariable("id") Integer id, @RequestBody WorkSchedules workSchedules) {
        WorkSchedules updatedWorkSchedules = workSchedulesService.updateWorkSchedules(id, workSchedules);
        return new ResponseEntity<>(updatedWorkSchedules, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkSchedules(@PathVariable("id") Integer id) {
        workSchedulesService.deleteWorkSchedules(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
