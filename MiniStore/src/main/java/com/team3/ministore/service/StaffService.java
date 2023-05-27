package com.team3.ministore.service;

import com.team3.ministore.model.Staff;

import java.util.List;

public interface StaffService {
    List<Staff> getAllStaff();

    Staff getStaffById(Integer id);

    Staff createStaff(Staff staff);

    Staff updateStaff(Integer id, Staff staff);

    void deleteStaff(Integer id);
}
