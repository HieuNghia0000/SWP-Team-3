package com.team3.ministore.service;

import com.team3.ministore.model.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StaffService {
    List<Staff> getAllStaff();

    Staff getStaffById(Integer id);

    List<Staff> getStaffByNameLike(String staffName);

    Staff createStaff(Staff staff);

    Staff updateStaff(Integer id, Staff staff);

    void deleteStaff(Integer id);

    Page<Staff> findAllPagingStaff(int pageIndex, int pageSize);
}
