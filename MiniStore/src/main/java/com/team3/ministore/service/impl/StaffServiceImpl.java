package com.team3.ministore.service.impl;

import com.team3.ministore.dto.RegisterDto;
import com.team3.ministore.dto.UpdateStaffDto;
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
import java.util.Optional;

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
    public Optional<Staff> getStaffById(Integer id) {
        return staffRepository.findById(id);
    }

    @Override
    public List<Staff> getStaffByNameLike(String staffName) {
        return staffRepository.findByStaffNameLike(staffName);
    }

    @Override
    public Staff createStaff(RegisterDto staffDto) {
        Staff staff = new Staff();
        staff.setPassword(encoder.encode(staffDto.getPassword()));

         return saveStaff(
                staff,
                staffDto.getStaffName(),
                staffDto.getRole(),
                staffDto.getUsername(),
                staffDto.getPhoneNumber(),
                staffDto.getStatus(),
                staffDto.getImage(),
                staffDto.getEmail(),
                staffDto.getWorkDays(),
                staffDto.getLeaveBalance()
        );
    }

    @Override
    public Optional<Staff> updateStaff(Integer id, UpdateStaffDto staff) {
        Optional<Staff> existingStaff = getStaffById(id);

        return existingStaff.map(value -> saveStaff(
                value,
                staff.getStaffName(),
                staff.getRole(),
                staff.getUsername(),
                staff.getPhoneNumber(),
                staff.getStatus(),
                staff.getImage(),
                staff.getEmail(),
                staff.getWorkDays(),
                staff.getLeaveBalance()
        ));
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
    public Optional<Staff> getStaffByEmail(String email) {
        return staffRepository.findByEmail(email);
    }

    @Override
    public Optional<Staff> getStaffByUsername(String username) {
        return staffRepository.findByUsername(username);
    }


    private Staff saveStaff(Staff staff, String staffName, Role role, String username,String phoneNumber, StaffStatus status, String image, String email, String workDays, Integer leaveBalance) {
        staff.setStaffName(staffName);
        staff.setRole(role);
        staff.setUsername(username);
        staff.setEmail(email);
        staff.setPhoneNumber(phoneNumber == null ? "" : phoneNumber);
        staff.setStatus(status == null ? StaffStatus.ACTIVE : status);
        staff.setImage(image == null ? "" : image);
        staff.setWorkDays(workDays == null ? "" : workDays);
        staff.setLeaveBalance(leaveBalance == null ? 0 : leaveBalance);

        return staffRepository.save(staff);
    }

}
