package com.team3.ministore.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Time;
import java.util.List;

@Entity
@Data
@Table(name = "shifts")
public class Shifts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shift_id")
    private int shiftId;

    @OneToMany(mappedBy = "shifts")
    private List<WorkSchedules> workSchedules;

    @Column(name = "start_time")
    private Time startTime;

    @Column(name = "end_time")
    private Time endTime;

    @Column(name = "slots")
    private int slots;

    @Column(name = "day_of_week")
    private int dayOfWeek;

    @Column(name = "salary_coefficient")
    private float salaryCoefficient;
}
