package com.team3.ministore.service;

import com.team3.ministore.model.TimeSheets;

import java.util.List;

public interface TimeSheetsService {
    List<TimeSheets> getAllTimeSheets();

    TimeSheets createTimeSheets(TimeSheets timeSheets);

    TimeSheets getTimeSheetsById(Integer id);

    TimeSheets updateTimeSheets(Integer id, TimeSheets timeSheets);

    void deleteTimeSheets(Integer id);
}
