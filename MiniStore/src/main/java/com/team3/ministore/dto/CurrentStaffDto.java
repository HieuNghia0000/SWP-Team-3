package com.team3.ministore.dto;

import com.team3.ministore.utils.Role;
import com.team3.ministore.utils.StaffStatus;
import lombok.Data;

@Data
public class CurrentStaffDto {

    private int staffId;
    private String username;
    private String staffName;
    private String email;
    private Role role;
    private StaffStatus status;
    private String image;
    private String phoneNumber;
    private Float baseSalary;
    private String workDays;
    private Integer leaveBalance;
}
