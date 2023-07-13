package com.team3.ministore.repository;

import com.team3.ministore.dto.SalaryDto;
import com.team3.ministore.model.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Integer> {

    @Query("SELECT new com.team3.ministore.dto.SalaryDto(sl.hourlyWage, sl.effectiveDate, sl.terminationDate, sl" +
            ".staff.staffId, sl.salaryId) " +
            "FROM Salary sl " +
            "WHERE sl.staff.staffId = :staffId " +
            "AND sl.effectiveDate <= CURRENT_DATE " +
            "AND (sl.terminationDate IS NULL OR sl.terminationDate >= CURRENT_DATE)")
    SalaryDto findSalaryInformationByStaffId(Integer staffId);

    @Query("SELECT new com.team3.ministore.dto.SalaryDto(sl.hourlyWage, sl.effectiveDate, sl.terminationDate, sl" +
            ".staff.staffId, sl.salaryId) " +
            "FROM Salary sl " +
            "WHERE sl.staff.staffId = :staffId " +
            "AND sl.effectiveDate <= CURRENT_DATE " +
            "AND (sl.terminationDate IS NULL OR sl.terminationDate >= CURRENT_DATE)")
    List<SalaryDto> findSalaryOfAllStaffs();

}
