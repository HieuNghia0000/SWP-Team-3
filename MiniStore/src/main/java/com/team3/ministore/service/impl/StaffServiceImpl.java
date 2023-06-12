package com.team3.ministore.service.impl;

import com.team3.ministore.dto.CurrentStaffDto;
import com.team3.ministore.dto.RegisterDto;
import com.team3.ministore.model.Staff;
import com.team3.ministore.repository.StaffRepository;
import com.team3.ministore.service.StaffService;
import com.team3.ministore.utils.Role;
import com.team3.ministore.utils.StaffStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;
    private final PasswordEncoder encoder;

    public StaffServiceImpl(StaffRepository staffRepository, PasswordEncoder encoder) {
        this.staffRepository = staffRepository;
        this.encoder = encoder;
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
    public List<Staff> getStaffByNameLike(String staffName) {
        return staffRepository.findByStaffNameLike(staffName);
    }

    @Override
    public Staff createStaff(RegisterDto staffDto) {
        Staff staff = new Staff();

        return saveStaff(
                staff,
                staffDto.getStaffName(),
                staffDto.getRole(),
                staffDto.getUsername(),
                staffDto.getPassword(),
                staffDto.getPhoneNumber(),
                staffDto.getBaseSalary(),
                staffDto.getStatus(),
                staffDto.getImage(),
                staffDto.getEmail(),
                staffDto.getWorkDays()
        );
    }

    @Override
    public Staff updateStaff(Integer id, Staff staff) {
        Staff existingStaff = getStaffById(id);

        return saveStaff(
                existingStaff,
                staff.getStaffName(),
                staff.getRole(),
                staff.getUsername(),
                staff.getPassword(),
                staff.getPhoneNumber(),
                staff.getBaseSalary(),
                staff.getStatus(),
                staff.getImage(),
                staff.getEmail(),
                staff.getWorkDays()
        );
    }

    @Override
    public void deleteStaff(Integer id) {
        staffRepository.deleteById(id);
    }

    @Override
    public Page<Staff> findAllPagingStaff(int pageIndex, int pageSize) {
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize);
        return staffRepository.findAllPagingStaff(pageable);
    }

    @Override
    public Staff getStaffByEmail(String email) {
        return staffRepository.getStaffByEmail(email);
    }

    @Override
    public Staff getStaffByUsername(String username) {
        return staffRepository.findByUsername(username);
    }

    @Override
    public CurrentStaffDto getCurrentStaffByUsername(String username) {
        CurrentStaffDto result = new CurrentStaffDto();
        Staff foundStaff = staffRepository.findByUsername(username);

        result.setStaffId(foundStaff.getStaffId());
        result.setUsername(foundStaff.getUsername());
        result.setStaffName(foundStaff.getStaffName());
        result.setRole(foundStaff.getRole());
        result.setEmail(foundStaff.getEmail());
        result.setPhoneNumber(foundStaff.getPhoneNumber());
        result.setStatus(foundStaff.getStatus());
        result.setBaseSalary(foundStaff.getBaseSalary());
        result.setWorkDays(foundStaff.getWorkDays());
        result.setImage(foundStaff.getImage());

        return result;
    }

    private Staff saveStaff(Staff staff, String staffName, Role role, String username, String password, String phoneNumber, Float baseSalary, StaffStatus status, String image, String email, String workDays) {
        staff.setStaffName(staffName);
        staff.setRole(role);
        staff.setUsername(username);
        staff.setPassword(encoder.encode(password));
        staff.setPhoneNumber(phoneNumber);
        staff.setBaseSalary(baseSalary);
        staff.setStatus(status);
        staff.setImage(image);
        staff.setEmail(email);
        staff.setWorkDays(workDays);

        return staffRepository.save(staff);
    }

}
