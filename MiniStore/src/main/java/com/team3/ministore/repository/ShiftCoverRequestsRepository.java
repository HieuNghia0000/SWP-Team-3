package com.team3.ministore.repository;

import com.team3.ministore.model.ShiftCoverRequests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftCoverRequestsRepository extends JpaRepository<ShiftCoverRequests, Integer> {
}
