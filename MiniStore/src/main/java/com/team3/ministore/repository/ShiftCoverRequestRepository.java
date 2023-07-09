package com.team3.ministore.repository;

import com.team3.ministore.model.ShiftCoverRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShiftCoverRequestRepository extends JpaRepository<ShiftCoverRequest, Integer> {
}
