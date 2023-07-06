package com.team3.ministore.model;

import lombok.Data;

import javax.persistence.*;
import java.sql.Time;

@Entity
@Data
@Table(name = "timesheets")
public class Timesheet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timesheet_id")
    private int timeSheetId;

    @OneToOne
    @JoinColumn(name = "shift_id", referencedColumnName = "shift_id")
    private Shift shift;

    @Column(name = "check_in_time")
    private Time checkInTime;

    @Column(name = "check_out_time")
    private Time checkOutTime;

    @Column(name = "status")
    private int status;

    @Column(name = "note_title", length = 100)
    private String noteTitle;

    @Column(name = "note_content", length = 100)
    private String noteContent;
}
