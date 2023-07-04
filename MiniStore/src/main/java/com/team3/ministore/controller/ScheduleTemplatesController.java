package com.team3.ministore.controller;

import com.team3.ministore.model.ScheduleTemplates;
import com.team3.ministore.service.ScheduleTemplatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedule-templates")
public class ScheduleTemplatesController {
    
    @Autowired
    private ScheduleTemplatesService scheduleTemplatesService;

    @GetMapping("")
    public ResponseEntity<List<ScheduleTemplates>> getAllScheduleTemplates() {
        List<ScheduleTemplates> scheduleTemplatesList = scheduleTemplatesService.getAllScheduleTemplates();
        return new ResponseEntity<>(scheduleTemplatesList, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<ScheduleTemplates> createScheduleTemplates(@RequestBody ScheduleTemplates scheduleTemplates) {
        ScheduleTemplates createdScheduleTemplates = scheduleTemplatesService.createScheduleTemplates(scheduleTemplates);
        return new ResponseEntity<>(createdScheduleTemplates, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ScheduleTemplates> updateScheduleTemplates(@PathVariable("id") Integer id, @RequestBody ScheduleTemplates scheduleTemplates) {
        ScheduleTemplates updatedScheduleTemplates = scheduleTemplatesService.updateScheduleTemplates(id, scheduleTemplates);
        return new ResponseEntity<>(updatedScheduleTemplates, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteScheduleTemplates(@PathVariable("id") Integer id) {
        scheduleTemplatesService.deleteScheduleTemplates(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
