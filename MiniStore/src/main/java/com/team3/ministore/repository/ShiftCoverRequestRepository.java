package com.team3.ministore.repository;

import com.team3.ministore.model.ShiftCoverRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftCoverRequestRepository extends JpaRepository<ShiftCoverRequest, Integer> {
    @Query("SELECT sc FROM ShiftCoverRequest sc ORDER BY sc.shiftCoverRequestId DESC")
    Page<ShiftCoverRequest> findAll(Pageable pageable);

    Page<ShiftCoverRequest> findAllByStaff_StaffNameContainingIgnoreCaseOrderByShiftCoverRequestIdDesc(String staffName, Pageable pageable);
}
