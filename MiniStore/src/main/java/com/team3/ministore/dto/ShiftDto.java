package com.team3.ministore.dto;

import com.team3.ministore.model.Shift;
import com.team3.ministore.model.ShiftCoverRequest;
import com.team3.ministore.model.ShiftTemplate;
import com.team3.ministore.model.Timesheet;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ShiftDto {

    private int shiftId;

    private LocalDate date;

    private Boolean published;

    private int staffId;

    private ShiftTemplate shiftTemplate;

    private Timesheet timesheet;

    private ShiftCoverRequest shiftCoverRequest;

    public ShiftDto(Shift shift) {
        this.shiftId = shift.getShiftId();
        this.date = shift.getDate();
        this.published = shift.getPublished();
        this.staffId = shift.getStaff().getStaffId();
        this.shiftTemplate = shift.getShiftTemplate();
        this.timesheet = shift.getTimesheet();
        this.shiftCoverRequest = shift.getShiftCoverRequest();
    }
}
