package com.team3.ministore.repository;

import com.team3.ministore.model.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

    Optional<Staff> findByUsername(String username);

    List<Staff> findByStaffNameContainingIgnoreCase(String staffName);

    Page<Staff> findAll(Pageable pageable);

    Optional<Staff> findByEmail(String email);

}
