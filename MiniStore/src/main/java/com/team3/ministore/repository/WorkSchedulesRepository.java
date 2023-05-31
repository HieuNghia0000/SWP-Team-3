package com.team3.ministore.repository;

import com.team3.ministore.model.WorkSchedules;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkSchedulesRepository extends JpaRepository<WorkSchedules, Integer> {
}
