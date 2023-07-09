package com.team3.ministore.dto;

import com.team3.ministore.utils.TimesheetStatus;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.sql.Time;

@Data
public class TimesheetDto {
    private int timesheetId;

    @NotNull(message = "Shift ID is required")
    private int shiftId;

    @NotNull(message = "Check in time is required")
    private Time checkInTime;

    private Time checkOutTime;

    private TimesheetStatus status;

    private String noteTitle;

    private String noteContent;

}
