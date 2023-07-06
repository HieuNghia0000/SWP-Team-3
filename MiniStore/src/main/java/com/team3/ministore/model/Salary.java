package com.team3.ministore.model;

import com.team3.ministore.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "salaries")
public class Salary extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "salary_id")
    private int salaryId;

    @Column(name = "hourly_wage")
    private String hourlyWage;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "termination_date")
    private LocalDate terminationDate;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

}
