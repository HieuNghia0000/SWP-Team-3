package com.team3.ministore.repository;

import com.team3.ministore.model.TimeOffRequests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeOffRequestsRepository extends JpaRepository<TimeOffRequests, Integer> {
}
