package com.team3.ministore.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "holidaycoef")
public class HolidayCoef {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "holiday_coef_id")
    private int holidayCoefId;

    @Column(name = "name")
    private String name;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "coefficient")
    private float coefficient;
}
