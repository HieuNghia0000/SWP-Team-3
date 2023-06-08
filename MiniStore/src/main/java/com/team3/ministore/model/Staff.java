package com.team3.ministore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.team3.ministore.common.entity.BaseEntity;
import com.team3.ministore.utils.Role;
import com.team3.ministore.utils.StaffStatus;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = false)
@Table(name = "staffs")
public class Staff extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_id")
    private int staffId;

    @OneToMany(mappedBy = "staff")
    private List<LeaveRequests> leaveRequests;

    @OneToMany(mappedBy = "staff")
    private List<WorkSchedules> workSchedules;

    @Column(name = "staff_name")
    private String staffName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @NotNull
    @Column(name = "username")
    private String username;

    @NotNull
    @Column(name = "email")
    private String email;

    @Column(name = "password")
    @NotNull
    @JsonIgnore
    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "base_salary")
    private Float baseSalary;

    @Column(name = "status")
    @Enumerated(EnumType.ORDINAL)
    private StaffStatus status;

    @Column(name = "image")
    private String image;

    @Column(name = "work_days")
    private String workDays;

}
