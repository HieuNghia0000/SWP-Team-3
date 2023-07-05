package com.team3.ministore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
@RequiredArgsConstructor
public class SalaryDto {
    @NotNull
    private final String hourlyWage;
    @NotNull
    private final Date effectiveDate;
    @NotNull
    private final Date terminationDate;
    @NotNull
    private final int staffId;
    private int salaryId;

    public SalaryDto(String hourlyWage, Date effectiveDate, Date terminationDate, int staffId, int salaryId) {
        this.hourlyWage = hourlyWage;
        this.effectiveDate = effectiveDate;
        this.terminationDate = terminationDate;
        this.staffId = staffId;
        this.salaryId = salaryId;
    }
}
