package com.team3.ministore.repository;

import com.team3.ministore.model.ScheduleTemplates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleTemplatesRepository extends JpaRepository<ScheduleTemplates, Integer> {
}
