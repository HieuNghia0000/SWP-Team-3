package com.team3.ministore.service.impl;

import com.team3.ministore.dto.TimesheetDto;
import com.team3.ministore.model.Shift;
import com.team3.ministore.model.Staff;
import com.team3.ministore.model.Timesheet;
import com.team3.ministore.repository.TimesheetRepository;
import com.team3.ministore.service.TimesheetService;
import com.team3.ministore.utils.TimesheetStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TimesheetServiceImpl implements TimesheetService {

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Override
    public List<TimesheetDto> getAllTimeSheets(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        return timesheetRepository.findAll(pageable).stream().map(t -> new TimesheetDto(t, true, true))
                .collect(Collectors.toList());
    }

    @Override
    public List<TimesheetDto> getAllTimeSheets(String search, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        return timesheetRepository.findByStaff_StaffNameContainingIgnoreCaseOrderByTimesheetIdDesc(search, pageable)
                .stream().map(t -> new TimesheetDto(t, true, true))
                .collect(Collectors.toList());
    }

    @Override
    public Timesheet createTimesheet(TimesheetDto dto, Shift shift, Staff staff) {
        Timesheet timesheet = new Timesheet();

        return saveTimesheet(
                timesheet,
                shift,
                staff,
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
    public Optional<Timesheet> updateTimesheet(Integer id, TimesheetDto timesheet, Shift shift, Staff staff) {
        Optional<Timesheet> existingTimesheet = getTimesheetById(id);

        return existingTimesheet.map(value -> saveTimesheet(
                value,
                shift,
                staff,
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

    private Timesheet saveTimesheet(Timesheet timesheet, Shift shift, Staff staff, Time checkInTime, Time checkOutTime, TimesheetStatus status,
                                    String noteTitle, String noteContent) {
        timesheet.setShift(shift);
        timesheet.setStaff(staff);
        timesheet.setCheckInTime(checkInTime);
        timesheet.setCheckOutTime(checkOutTime);
        timesheet.setStatus(status == null ? TimesheetStatus.PENDING : status);
        timesheet.setNoteTitle(noteTitle == null ? "" : noteTitle);
        timesheet.setNoteContent(noteContent == null ? "" : noteContent);

        return timesheetRepository.save(timesheet);
    }

}
