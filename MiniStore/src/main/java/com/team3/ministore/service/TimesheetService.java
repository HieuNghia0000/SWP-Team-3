package com.team3.ministore.service;

import com.team3.ministore.dto.TimesheetDto;
import com.team3.ministore.model.Shift;
import com.team3.ministore.model.Timesheet;

import java.util.List;
import java.util.Optional;

public interface TimesheetService {
    List<Timesheet> getAllTimeSheets();

    Timesheet createTimesheet(TimesheetDto timesheet, Shift shift);

    Optional<Timesheet> getTimesheetById(Integer id);

    Optional<Timesheet> updateTimesheet(Integer id, TimesheetDto timesheet, Shift shift);

    void deleteTimesheet(Integer id);
}
