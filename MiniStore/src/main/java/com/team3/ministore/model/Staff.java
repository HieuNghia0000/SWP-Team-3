package com.team3.ministore.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "Staffs")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_id")
    private int staffId;

    @OneToMany(mappedBy = "staff")
    private List<LeaveRequests> leaveRequests;

    @Column(name = "staff_name")
    private String staffName;

    @Column(name = "role")
    private String role;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "base_salary")
    private Float baseSalary;

    @Column(name = "status")
    private int status;

    @Column(name = "image")
    private String image;

    @Column(name = "email")
    private String email;

    @Column(name = "work_days")
    private String workDays;

}
