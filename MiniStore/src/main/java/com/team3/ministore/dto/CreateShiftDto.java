package com.team3.ministore.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class CreateShiftDto {
    @NotNull(message = "Staff id must not be null")
    private int staffId;

    @NotNull(message = "ShiftTemplateId id must not be null")
    private int shiftTemplateId;

    @NotNull(message = "Date must not be null")
    private LocalDate date;

    @NotNull(message = "Published must not be null")
    private boolean published;
}
