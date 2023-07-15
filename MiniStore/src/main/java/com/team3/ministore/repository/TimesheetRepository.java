package com.team3.ministore.repository;

import com.team3.ministore.model.Timesheet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, Integer> {
    @Query("SELECT t FROM Timesheet t ORDER BY t.timesheetId DESC")
    Page<Timesheet> findAll(Pageable pageable);

    Page<Timesheet> findByShift_Staff_StaffNameContainingIgnoreCaseOrderByTimesheetIdDesc(String staff_staffName, Pageable pageable);
}
