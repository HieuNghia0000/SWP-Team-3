package com.team3.ministore.service.impl;

import com.team3.ministore.model.Timesheet;
import com.team3.ministore.repository.TimesheetRepository;
import com.team3.ministore.service.TimesheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimesheetServiceImpl implements TimesheetService {

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Override
    public List<Timesheet> getAllTimeSheets() {
        return timesheetRepository.findAll();
    }

    @Override
    public Timesheet createTimeSheets(Timesheet timesheet) {
        return timesheetRepository.save(timesheet);
    }

    @Override
    public Timesheet getTimeSheetsById(Integer id) {
        return timesheetRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Time Sheet ID: " + id));
    }

    @Override
    public Timesheet updateTimeSheets(Integer id, Timesheet timesheet) {
        Timesheet existingTimesheet = getTimeSheetsById(id);

        existingTimesheet.setShift(timesheet.getShift());
        existingTimesheet.setCheckInTime(timesheet.getCheckInTime());
        existingTimesheet.setCheckOutTime(timesheet.getCheckOutTime());
        existingTimesheet.setStatus(timesheet.getStatus());
        existingTimesheet.setNoteTitle(timesheet.getNoteTitle());
        existingTimesheet.setNoteContent(timesheet.getNoteContent());

        return timesheetRepository.save(existingTimesheet);
    }

    @Override
    public void deleteTimeSheets(Integer id) {
        timesheetRepository.deleteById(id);
    }
}
