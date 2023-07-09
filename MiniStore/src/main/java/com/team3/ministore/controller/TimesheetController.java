package com.team3.ministore.controller;

import com.team3.ministore.common.responsehandler.ResponseHandler;
import com.team3.ministore.dto.ShiftDto;
import com.team3.ministore.dto.TimesheetDto;
import com.team3.ministore.model.Shift;
import com.team3.ministore.model.Timesheet;
import com.team3.ministore.service.ShiftService;
import com.team3.ministore.service.TimesheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/timesheets")
public class TimesheetController {

    @Autowired
    private TimesheetService timesheetService;

    @Autowired
    private ShiftService shiftService;

    @PostMapping("/add")
    public ResponseEntity<Object> createTimesheet(@Valid @RequestBody TimesheetDto dto, BindingResult errors) {
        if (errors.hasErrors()) return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);

        Optional<Shift> shift = shiftService.getShiftById(dto.getShiftId());
        if (shift.isEmpty()) return ResponseHandler.getResponse(new Exception("Shift not found"), HttpStatus.NOT_FOUND);

        Timesheet timesheet = timesheetService.createTimesheet(dto);
        shift.get().setTimesheet(timesheet);

        ShiftDto updatedShift = shiftService.updateShift(shift.get());

        return  ResponseHandler.getResponse(updatedShift.getTimesheet(), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<Object> getAllTimeSheets() {
        List<Timesheet> timesheetList = timesheetService.getAllTimeSheets();
        return ResponseHandler.getResponse(timesheetList, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateTimesheet(@PathVariable("id") Integer id, @RequestBody TimesheetDto dto,
                                                  BindingResult errors) {
        if (errors.hasErrors()) return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);

        Optional<Timesheet> updatedTimesheet = timesheetService.updateTimesheet(id, dto);

        return updatedTimesheet.map(timesheet -> ResponseHandler.getResponse(timesheet, HttpStatus.OK))
                .orElseGet(() -> ResponseHandler.getResponse(new Exception("Timesheet not found"), HttpStatus.NOT_FOUND));

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTimesheet(@PathVariable("id") Integer id) {
        timesheetService.deleteTimesheet(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
