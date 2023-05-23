package com.team3.ministore.model;

import javax.persistence.*;

@Entity
@Table(name = "Staffs")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "staff_name")
    private String staffName;

    private String role;

    private String username;

    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "base_salary")
    private Float baseSalary;

    private int status;

    private String image;

    private String email;

    @Column(name = "work_days")
    private String workDays;

    public Staff(String staffName, String role, String username, String password, String phoneNumber, Float baseSalary, int status, String image, String email, String workDays) {
        this.staffName = staffName;
        this.role = role;
        this.username = username;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.baseSalary = baseSalary;
        this.status = status;
        this.image = image;
        this.email = email;
        this.workDays = workDays;
    }

    public Staff() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Float getBaseSalary() {
        return baseSalary;
    }

    public void setBaseSalary(Float baseSalary) {
        this.baseSalary = baseSalary;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWorkDays() {
        return workDays;
    }

    public void setWorkDays(String workDays) {
        this.workDays = workDays;
    }
}
