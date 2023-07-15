package com.team3.ministore.service.impl;

import com.team3.ministore.dto.TimesheetDto;
import com.team3.ministore.model.Shift;
import com.team3.ministore.model.Timesheet;
import com.team3.ministore.repository.TimesheetRepository;
import com.team3.ministore.service.TimesheetService;
import com.team3.ministore.utils.TimesheetStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.List;
import java.util.Optional;

@Service
public class TimesheetServiceImpl implements TimesheetService {

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Override
    public List<Timesheet> getAllTimeSheets() {
        return timesheetRepository.findAll();
    }

    @Override
    public Timesheet createTimesheet(TimesheetDto dto, Shift shift) {
        Timesheet timesheet = new Timesheet();

        return saveTimesheet(
                timesheet,
                shift,
                dto.getCheckInTime(),
                dto.getCheckOutTime(),
                dto.getStatus(),
                dto.getNoteTitle(),
                dto.getNoteContent()
        );
    }

    @Override
    public Optional<Timesheet> getTimesheetById(Integer id) {
        return timesheetRepository.findById(id);
    }

    @Override
    public Optional<Timesheet> updateTimesheet(Integer id, TimesheetDto timesheet, Shift shift) {
        Optional<Timesheet> existingTimesheet = getTimesheetById(id);

        return existingTimesheet.map(value -> saveTimesheet(
                value,
                shift,
                timesheet.getCheckInTime(),
                timesheet.getCheckOutTime(),
                timesheet.getStatus(),
                timesheet.getNoteTitle(),
                timesheet.getNoteContent()
        ));
    }

    @Override
    public void deleteTimesheet(Integer id) {
        timesheetRepository.deleteById(id);
    }

    private Timesheet saveTimesheet(Timesheet timesheet, Shift shift, Time checkInTime, Time checkOutTime, TimesheetStatus status,
                                    String noteTitle, String noteContent) {
        timesheet.setShift(shift);
        timesheet.setCheckInTime(checkInTime);
        timesheet.setCheckOutTime(checkOutTime);
        timesheet.setStatus(status == null ? TimesheetStatus.PENDING : status);
        timesheet.setNoteTitle(noteTitle == null ? "" : noteTitle);
        timesheet.setNoteContent(noteContent == null ? "" : noteContent);

        return timesheetRepository.save(timesheet);
    }

}
