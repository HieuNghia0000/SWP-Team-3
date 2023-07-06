package com.team3.ministore.controller;

import com.team3.ministore.common.responsehandler.ResponseHandler;
import com.team3.ministore.dto.CreateShiftDto;
import com.team3.ministore.dto.ShiftDto;
import com.team3.ministore.model.Shift;
import com.team3.ministore.service.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/shifts")
public class ShiftController {

    @Autowired
    private ShiftService shiftService;

    @PostMapping("/add")
    public ResponseEntity<Object> createShift(@Valid @RequestBody CreateShiftDto shift, BindingResult errors) {
        if (errors.hasErrors()) return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);

        Optional<ShiftDto> createdShift = shiftService.createShift(shift);
        return createdShift.map(value -> ResponseHandler.getResponse(value, HttpStatus.OK))
                .orElseGet(() -> ResponseHandler.getResponse(new Exception("Invalid staff id or shift template id"),
                        HttpStatus.BAD_REQUEST));
    }

    @GetMapping("/list")
    public ResponseEntity<Object> getAllShifts() {
        return ResponseHandler.getResponse(shiftService.getAllShifts(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getShiftById(@PathVariable("id") Integer id) {
        Optional<Shift> shift = shiftService.getShiftById(id);
        return new ResponseEntity<>(shift, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateShifts(@PathVariable("id") Integer id, @RequestBody Shift shift) {
        Optional<Shift> updatedShift = shiftService.updateShift(id, shift);
        return new ResponseEntity<>(updatedShift, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteShifts(@PathVariable("id") Integer id) {
        shiftService.deleteShift(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

