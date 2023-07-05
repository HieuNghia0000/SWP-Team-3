package com.team3.ministore.model;

import com.team3.ministore.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.Date;

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
    private Date effectiveDate;

    @Column(name = "termination_date")
    private Date terminationDate;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

}
