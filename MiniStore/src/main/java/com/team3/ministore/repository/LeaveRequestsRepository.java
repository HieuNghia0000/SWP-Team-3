package com.team3.ministore.repository;

import com.team3.ministore.model.LeaveRequests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaveRequestsRepository extends JpaRepository<LeaveRequests, Integer> {
}
