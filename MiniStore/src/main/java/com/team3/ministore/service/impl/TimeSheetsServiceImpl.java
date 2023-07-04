package com.team3.ministore.service.impl;

import com.team3.ministore.model.TimeSheets;
import com.team3.ministore.repository.TimeSheetsRepository;
import com.team3.ministore.service.TimeSheetsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimeSheetsServiceImpl implements TimeSheetsService {

    @Autowired
    private TimeSheetsRepository timeSheetsRepository;

    @Override
    public List<TimeSheets> getAllTimeSheets() {
        return timeSheetsRepository.findAll();
    }

    @Override
    public TimeSheets createTimeSheets(TimeSheets timeSheets) {
        return timeSheetsRepository.save(timeSheets);
    }

    @Override
    public TimeSheets getTimeSheetsById(Integer id) {
        return timeSheetsRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Time Sheet ID: " + id));
    }

    @Override
    public TimeSheets updateTimeSheets(Integer id, TimeSheets timeSheets) {
        TimeSheets existingTimeSheets = getTimeSheetsById(id);

        existingTimeSheets.setShifts(timeSheets.getShifts());
        existingTimeSheets.setCheckInTime(timeSheets.getCheckInTime());
        existingTimeSheets.setCheckOutTime(timeSheets.getCheckOutTime());
        existingTimeSheets.setStatus(timeSheets.getStatus());
        existingTimeSheets.setNoteTitle(timeSheets.getNoteTitle());
        existingTimeSheets.setNoteContent(timeSheets.getNoteContent());

        return timeSheetsRepository.save(existingTimeSheets);
    }

    @Override
    public void deleteTimeSheets(Integer id) {
        timeSheetsRepository.deleteById(id);
    }
}
