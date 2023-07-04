package com.team3.ministore.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "shiftcoverrequests")
public class ShiftCoverRequests {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shift_cover_request_id")
    private int shiftCoverRequestId;

    @OneToOne
    @JoinColumn(name = "shift_id", referencedColumnName = "shift_id")
    private Shifts shifts;

    @ManyToOne
    @JoinColumn(name = "staff_id" ,referencedColumnName = "staff_id")
    private Staff staff;

    @Column(name = "note", length = 400)
    private String note;

    @Column(name = "status")
    private int status;
}
