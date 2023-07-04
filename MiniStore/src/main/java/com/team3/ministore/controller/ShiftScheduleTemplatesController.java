package com.team3.ministore.controller;

import com.team3.ministore.model.ShiftScheduleTemplates;
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
    public ResponseEntity<List<ShiftScheduleTemplates>> getAllShiftScheduleTemplates() {
        List<ShiftScheduleTemplates> shiftScheduleTemplatesList = shiftScheduleTemplatesService.getAllShiftScheduleTemplates();
        return new ResponseEntity<>(shiftScheduleTemplatesList, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<ShiftScheduleTemplates> createShiftScheduleTemplates(@RequestBody ShiftScheduleTemplates shiftScheduleTemplates) {
        ShiftScheduleTemplates createdShiftScheduleTemplates = shiftScheduleTemplatesService.createShiftScheduleTemplates(shiftScheduleTemplates);
        return new ResponseEntity<>(createdShiftScheduleTemplates, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ShiftScheduleTemplates> updateShiftScheduleTemplates(@PathVariable("id") Integer id, @RequestBody ShiftScheduleTemplates shiftScheduleTemplates) {
        ShiftScheduleTemplates updatedShiftScheduleTemplates = shiftScheduleTemplatesService.updateShiftScheduleTemplates(id, shiftScheduleTemplates);
        return new ResponseEntity<>(updatedShiftScheduleTemplates, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteShiftScheduleTemplates(@PathVariable("id") Integer id) {
        shiftScheduleTemplatesService.deleteShiftScheduleTemplates(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
