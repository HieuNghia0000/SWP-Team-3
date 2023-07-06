package com.team3.ministore.controller;

import com.team3.ministore.model.Timesheet;
import com.team3.ministore.service.TimesheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/time-sheets")
public class TimesheetController {

    @Autowired
    private TimesheetService timesheetService;

    @GetMapping()
    public ResponseEntity<List<Timesheet>> getAllTimeSheets() {
        List<Timesheet> timesheetList = timesheetService.getAllTimeSheets();
        return new ResponseEntity<>(timesheetList, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Timesheet> createTimeSheets(@RequestBody Timesheet timesheet) {
        Timesheet createdTimesheet = timesheetService.createTimeSheets(timesheet);
        return new ResponseEntity<>(createdTimesheet, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Timesheet> updateTimeSheets(@PathVariable("id") Integer id, @RequestBody Timesheet timesheet) {
        Timesheet updatedTimesheet = timesheetService.updateTimeSheets(id, timesheet);
        return new ResponseEntity<>(updatedTimesheet, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTimeSheets(@PathVariable("id") Integer id) {
        timesheetService.deleteTimeSheets(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
