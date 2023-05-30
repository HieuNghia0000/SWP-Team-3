package com.team3.ministore.repository;

import com.team3.ministore.model.Revenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RevenueRepository extends JpaRepository<Revenue, Integer> {
}
