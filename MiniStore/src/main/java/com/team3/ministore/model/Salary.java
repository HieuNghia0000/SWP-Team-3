package com.team3.ministore.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@Table(name = "salaries")
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "salary_id")
    private int salaryId;

    @ManyToOne
    @JoinColumn(name = "staff_id", referencedColumnName = "staff_id")
    private Staff staff;

    @Column(name = "hourly_wage")
    private Float hourlyWage;

    @Column(name = "effective_date")
    private Date effectiveDate;

    @Column(name = "termination_date")
    private Date terminationDate;
}
