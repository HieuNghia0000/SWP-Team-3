package com.team3.ministore.repository;

import com.team3.ministore.model.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftsRepository extends JpaRepository<Shift, Integer> {
}
