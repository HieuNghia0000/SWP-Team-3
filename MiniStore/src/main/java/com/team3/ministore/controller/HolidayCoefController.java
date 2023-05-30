package com.team3.ministore.controller;

import com.team3.ministore.model.HolidayCoef;
import com.team3.ministore.service.HolidayCoefService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/holidaycoef")
public class HolidayCoefController {
    @Autowired
    private HolidayCoefService holidayCoefService;

    @PostMapping("/")
    public ResponseEntity<HolidayCoef> createHolidayCoef(@RequestBody HolidayCoef holidayCoef) {
        HolidayCoef createdHolidayCoef = holidayCoefService.createHolidayCoef(holidayCoef);
        return new ResponseEntity<>(createdHolidayCoef, HttpStatus.CREATED);
    }

    @GetMapping("/")
    public ResponseEntity<List<HolidayCoef>> getAllHolidayCoef() {
        List<HolidayCoef> holidayCoefList = holidayCoefService.getAllHolidayCoef();
        return new ResponseEntity<>(holidayCoefList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HolidayCoef> getHolidayCoefById(@PathVariable("id") Integer id) {
        HolidayCoef holidayCoef = holidayCoefService.getHolidayCoefById(id);
        return new ResponseEntity<>(holidayCoef, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HolidayCoef> updateHolidayCoef(@PathVariable("id") Integer id, @RequestBody HolidayCoef holidayCoef) {
        HolidayCoef updatedHolidayCoef = holidayCoefService.updateHolidayCoef(id, holidayCoef);
        return new ResponseEntity<>(updatedHolidayCoef, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHolidayCoef(@PathVariable("id") Integer id) {
        holidayCoefService.deleteHolidayCoef(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
