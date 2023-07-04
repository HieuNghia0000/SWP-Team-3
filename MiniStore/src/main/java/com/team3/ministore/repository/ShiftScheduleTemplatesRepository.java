package com.team3.ministore.repository;

import com.team3.ministore.model.ShiftScheduleTemplates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftScheduleTemplatesRepository extends JpaRepository<ShiftScheduleTemplates, Integer> {
}
