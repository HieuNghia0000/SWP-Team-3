package com.team3.ministore.model;

import lombok.Data;

import javax.persistence.*;
import java.sql.Time;
import java.util.Date;

@Entity
@Data
@Table(name = "workschedules")
public class WorkSchedules {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private int scheduleId;

    @ManyToOne
    @JoinColumn(name = "staff_id", referencedColumnName = "staff_id")
    private Staff staff;

    @ManyToOne
    @JoinColumn(name = "shift_id", referencedColumnName = "shift_id")
    private Shifts shifts;

    @Column(name = "work_date")
    private Date workDate;

    @Column(name = "check_in_time")
    private Time checkInTime;

    @Column(name = "check_out_time")
    private Time checkOutTime;

    @Column(name = "status")
    private int status;

    @Column(name = "published")
    private boolean published;
}
