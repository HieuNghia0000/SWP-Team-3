package com.team3.ministore.dto;

import com.team3.ministore.model.Shift;
import com.team3.ministore.model.ShiftCoverRequest;
import com.team3.ministore.model.Timesheet;
import com.team3.ministore.utils.Role;
import lombok.Data;

import java.sql.Time;
import java.time.LocalDate;

@Data
public class ShiftDto {

    private int shiftId;

    private LocalDate date;

    private Boolean published;

    private int staffId;

    private Role role;

    private Float salaryCoefficient;

    private String name;

    private Time startTime;

    private Time endTime;

    private Timesheet timesheet;

    private ShiftCoverRequest shiftCoverRequest;


    public ShiftDto(Shift shift) {
        this.shiftId = shift.getShiftId();
        this.date = shift.getDate();
        this.published = shift.getPublished();
        this.role = shift.getRole();
        this.salaryCoefficient = shift.getSalaryCoefficient();
        this.name = shift.getName();
        this.startTime = shift.getStartTime();
        this.endTime = shift.getEndTime();
        this.staffId = shift.getStaff().getStaffId();
        this.timesheet = shift.getTimesheet();
        this.shiftCoverRequest = shift.getShiftCoverRequest();
    }
}
