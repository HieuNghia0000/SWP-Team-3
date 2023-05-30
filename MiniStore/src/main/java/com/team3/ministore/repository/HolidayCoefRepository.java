package com.team3.ministore.repository;

import com.team3.ministore.model.HolidayCoef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HolidayCoefRepository extends JpaRepository<HolidayCoef, Integer> {
}
