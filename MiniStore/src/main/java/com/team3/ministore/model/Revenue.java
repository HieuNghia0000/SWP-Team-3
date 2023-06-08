package com.team3.ministore.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@Table(name = "revenue")
public class Revenue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "revenue_id")
    private int revenueId;

    @Column(name = "date")
    private Date date;

    @Column(name = "amount")
    private float amount;
}
