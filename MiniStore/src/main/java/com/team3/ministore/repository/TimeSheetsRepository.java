package com.team3.ministore.repository;

import com.team3.ministore.model.TimeSheets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeSheetsRepository extends JpaRepository<TimeSheets, Integer> {
}
