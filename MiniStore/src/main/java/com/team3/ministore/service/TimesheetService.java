package com.team3.ministore.service;

import com.team3.ministore.model.Timesheet;

import java.util.List;

public interface TimesheetService {
    List<Timesheet> getAllTimeSheets();

    Timesheet createTimeSheets(Timesheet timesheet);

    Timesheet getTimeSheetsById(Integer id);

    Timesheet updateTimeSheets(Integer id, Timesheet timesheet);

    void deleteTimeSheets(Integer id);
}
