package com.team3.ministore.controller;

import com.team3.ministore.model.Holidays;
import com.team3.ministore.service.HolidaysService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/holidays")
public class HolidaysController {
    @Autowired
    private HolidaysService holidaysService;

    @PostMapping("/add")
    public ResponseEntity<Holidays> createHolidays(@RequestBody Holidays holidays) {
        Holidays createdHolidays = holidaysService.createHolidays(holidays);
        return new ResponseEntity<>(createdHolidays, HttpStatus.CREATED);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Holidays>> getAllHolidays() {
        List<Holidays> holidaysList = holidaysService.getAllHolidays();
        return new ResponseEntity<>(holidaysList, HttpStatus.OK);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<Holidays> getHolidaysById(@PathVariable("id") Integer id) {
        Holidays holidays = holidaysService.getHolidaysById(id);
        return new ResponseEntity<>(holidays, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Holidays> updateHolidays(@PathVariable("id") Integer id, @RequestBody Holidays holidays) {
        Holidays updatedHolidays = holidaysService.updateHolidays(id, holidays);
        return new ResponseEntity<>(updatedHolidays, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteHolidays(@PathVariable("id") Integer id) {
        holidaysService.deleteHolidays(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
