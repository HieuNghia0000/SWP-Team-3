package com.team3.ministore.controller;

import com.team3.ministore.model.ShiftScheduleTemplate;
import com.team3.ministore.service.ShiftScheduleTemplatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shift-schedule-templates")
public class ShiftScheduleTemplatesController {

    @Autowired
    private ShiftScheduleTemplatesService shiftScheduleTemplatesService;

    @GetMapping("")
    public ResponseEntity<List<ShiftScheduleTemplate>> getAllShiftScheduleTemplates() {
        List<ShiftScheduleTemplate> shiftScheduleTemplateList = shiftScheduleTemplatesService.getAllShiftScheduleTemplates();
        return new ResponseEntity<>(shiftScheduleTemplateList, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<ShiftScheduleTemplate> createShiftScheduleTemplates(@RequestBody ShiftScheduleTemplate shiftScheduleTemplate) {
        ShiftScheduleTemplate createdShiftScheduleTemplate = shiftScheduleTemplatesService.createShiftScheduleTemplates(shiftScheduleTemplate);
        return new ResponseEntity<>(createdShiftScheduleTemplate, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ShiftScheduleTemplate> updateShiftScheduleTemplates(@PathVariable("id") Integer id, @RequestBody ShiftScheduleTemplate shiftScheduleTemplate) {
        ShiftScheduleTemplate updatedShiftScheduleTemplate = shiftScheduleTemplatesService.updateShiftScheduleTemplates(id, shiftScheduleTemplate);
        return new ResponseEntity<>(updatedShiftScheduleTemplate, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteShiftScheduleTemplates(@PathVariable("id") Integer id) {
        shiftScheduleTemplatesService.deleteShiftScheduleTemplates(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
