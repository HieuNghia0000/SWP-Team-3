package com.team3.ministore.service;

import com.team3.ministore.model.Staff;
import com.team3.ministore.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;

    public StaffServiceImpl(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    @Override
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @Override
    public Staff getStaffById(Integer id) {
        return staffRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid staff ID: " + id));
    }

    @Override
    public Staff createStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    @Override
    public Staff updateStaff(Integer id, Staff staff) {
        Staff existingStaff = getStaffById(id);

        existingStaff.setStaffName(staff.getStaffName());
        existingStaff.setRole(staff.getRole());
        existingStaff.setUsername(staff.getUsername());
        existingStaff.setPassword(staff.getPassword());
        existingStaff.setPhoneNumber(staff.getPhoneNumber());
        existingStaff.setBaseSalary(staff.getBaseSalary());
        existingStaff.setStatus(staff.getStatus());
        existingStaff.setImage(staff.getImage());
        existingStaff.setEmail(staff.getEmail());
        existingStaff.setWorkDays(staff.getWorkDays());

        return staffRepository.save(existingStaff);
    }

    @Override
    public void deleteStaff(Integer id) {
        staffRepository.deleteById(id);
    }
}
