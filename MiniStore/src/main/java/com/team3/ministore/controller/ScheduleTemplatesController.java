package com.team3.ministore.controller;

import com.team3.ministore.model.ScheduleTemplate;
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
    public ResponseEntity<List<ScheduleTemplate>> getAllScheduleTemplates() {
        List<ScheduleTemplate> scheduleTemplateList = scheduleTemplatesService.getAllScheduleTemplates();
        return new ResponseEntity<>(scheduleTemplateList, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<ScheduleTemplate> createScheduleTemplates(@RequestBody ScheduleTemplate scheduleTemplate) {
        ScheduleTemplate createdScheduleTemplate = scheduleTemplatesService.createScheduleTemplates(scheduleTemplate);
        return new ResponseEntity<>(createdScheduleTemplate, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ScheduleTemplate> updateScheduleTemplates(@PathVariable("id") Integer id, @RequestBody ScheduleTemplate scheduleTemplate) {
        ScheduleTemplate updatedScheduleTemplate = scheduleTemplatesService.updateScheduleTemplates(id, scheduleTemplate);
        return new ResponseEntity<>(updatedScheduleTemplate, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteScheduleTemplates(@PathVariable("id") Integer id) {
        scheduleTemplatesService.deleteScheduleTemplates(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
