package com.team3.ministore.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
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
