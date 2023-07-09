package com.team3.ministore.dto;

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

    //    Do not delete this constructor. It is used in SalaryRepository.java
    public SalaryDto(String hourlyWage, LocalDate effectiveDate, LocalDate terminationDate, int staffId, int salaryId) {
        this.hourlyWage = hourlyWage;
        this.effectiveDate = effectiveDate;
        this.terminationDate = terminationDate;
        this.staffId = staffId;
        this.salaryId = salaryId;
    }
}
