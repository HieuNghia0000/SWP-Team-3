package com.team3.ministore.repository;

import com.team3.ministore.model.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

    @Query("SELECT s FROM Staff s WHERE s.username = :username")
    Staff findByUsername(@Param("username") String username);

    @Query("SELECT s FROM Staff s WHERE s.staffName LIKE %:staffName%")
    List<Staff> findByStaffNameLike(@Param("staffName") String staffName);

    @Query("SELECT s FROM Staff s")
    Page<Staff> findAllPagingStaff(Pageable pageable);

    @Query("SELECT s FROM Staff s WHERE s.email = :email")
    Staff getStaffByEmail(@Param("email") String email);
}
