package com.team3.ministore.service;

import com.team3.ministore.dto.StaffDto;
import com.team3.ministore.dto.RegisterDto;
import com.team3.ministore.dto.UpdateStaffDto;
import com.team3.ministore.model.Staff;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface StaffService {
    List<Staff> getAllStaff();

    Optional<Staff> getStaffById(Integer id);

    List<Staff> getStaffByNameLike(String staffName);

    Staff createStaff(RegisterDto staff);

    Optional<Staff> updateStaff(Integer id, UpdateStaffDto staff);

    void deleteStaff(Integer id);

    Page<Staff> findAllPagingStaff(int pageIndex, int pageSize);

    Staff getStaffByEmail(String email);

    Staff getStaffByUsername(String username);

    StaffDto getCurrentStaffByUsername(String username);

}
