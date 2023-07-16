package com.team3.ministore.service;

import com.team3.ministore.dto.TimesheetDto;
import com.team3.ministore.model.Shift;
import com.team3.ministore.model.Staff;
import com.team3.ministore.model.Timesheet;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TimesheetService {

    List<TimesheetDto> getAllTimeSheets(int page, int pageSize, LocalDate fromDate, LocalDate toDate);

    List<TimesheetDto> getAllTimeSheets(String search, int page, int pageSize, LocalDate fromDate, LocalDate toDate);

    Timesheet createTimesheet(TimesheetDto dto, Shift shift, Staff staff);

    Optional<Timesheet> getTimesheetById(Integer id);

    Optional<Timesheet> updateTimesheet(Integer id, TimesheetDto timesheet, Shift shift, Staff staff);

    void deleteTimesheet(Integer id);
}
