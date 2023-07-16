package com.team3.ministore.dto;

import com.team3.ministore.model.Salary;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@RequiredArgsConstructor
public class SalaryDto {
    @NotNull
    private final String hourlyWage;
    @NotNull
    private final LocalDate effectiveDate;
    @NotNull
    private final LocalDate terminationDate;
    @NotNull
    private final int staffId;
    private int salaryId;

    public SalaryDto(Salary salary){
        this.hourlyWage = salary.getHourlyWage();
        this.effectiveDate = salary.getEffectiveDate();
        this.terminationDate = salary.getTerminationDate();
        this.staffId = salary.getStaff().getStaffId();
        this.salaryId = salary.getSalaryId();
    }
}
