package com.team3.ministore.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "shiftcoverrequests")
public class ShiftCoverRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shift_cover_request_id")
    private int shiftCoverRequestId;

    @Column(name = "note", length = 400)
    private String note;

    @Column(name = "status")
    private int status;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;
}
