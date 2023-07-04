package com.team3.ministore.model;

import lombok.Data;

import javax.persistence.*;
import java.sql.Time;

@Entity
@Data
@Table(name = "shifttemplates")
public class ShiftTemplates {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shift_template_id")
    private int shiftTemplateId;

    @Column(name = "start_time")
    private Time startTime;

    @Column(name = "end_time")
    private Time endTime;

    @Column(name = "name", length = 50)
    private String name;

    @Column(name = "salary_coefficient")
    private Float salaryCoefficient;

    @Column(name = "role", length = 50)
    private String role;
}
