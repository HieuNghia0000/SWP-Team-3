package com.team3.ministore.model;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
@Table(name = "shifts")
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shift_id")
    private int shiftId;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "published")
    private Boolean published;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @ManyToOne
    @JoinColumn(name = "shift_template_id")
    private ShiftTemplate shiftTemplate;

    @OneToOne
    @JoinColumn(name = "timesheet_id")
    private Timesheet timesheet;

    @OneToOne
    @JoinColumn(name = "shift_cover_request_id")
    private ShiftCoverRequest shiftCoverRequest;

}
