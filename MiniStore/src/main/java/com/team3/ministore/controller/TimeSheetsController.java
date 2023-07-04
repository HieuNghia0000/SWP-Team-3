package com.team3.ministore.controller;

import com.team3.ministore.model.TimeSheets;
import com.team3.ministore.service.TimeSheetsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/time-sheets")
public class TimeSheetsController {

    @Autowired
    private TimeSheetsService timeSheetsService;

    @GetMapping("")
    public ResponseEntity<List<TimeSheets>> getAllTimeSheets() {
        List<TimeSheets> timeSheetsList = timeSheetsService.getAllTimeSheets();
        return new ResponseEntity<>(timeSheetsList, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<TimeSheets> createTimeSheets(@RequestBody TimeSheets timeSheets) {
        TimeSheets createdTimeSheets = timeSheetsService.createTimeSheets(timeSheets);
        return new ResponseEntity<>(createdTimeSheets, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TimeSheets> updateTimeSheets(@PathVariable("id") Integer id, @RequestBody TimeSheets timeSheets) {
        TimeSheets updatedTimeSheets = timeSheetsService.updateTimeSheets(id, timeSheets);
        return new ResponseEntity<>(updatedTimeSheets, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTimeSheets(@PathVariable("id") Integer id) {
        timeSheetsService.deleteTimeSheets(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
