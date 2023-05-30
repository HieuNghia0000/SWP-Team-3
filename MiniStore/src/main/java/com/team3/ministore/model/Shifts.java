package com.team3.ministore.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Time;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "shifts")
public class Shifts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shift_id")
    private int shiftId;

    @Column(name = "start_time")
    private Time startTime;

    @Column(name = "end_time")
    private Time endTime;

    @Column(name = "sheet_number")
    private int sheetNumber;

    @Column(name = "day_of_week")
    private int dayOfWeek;

    @Column(name = "salary_coefficient")
    private float salaryCoefficient;
}
