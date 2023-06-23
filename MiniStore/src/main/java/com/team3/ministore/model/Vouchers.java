package com.team3.ministore.model;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Data
@Table(name = "vouchers")
public class Vouchers {

    @Id
    @Column(name = "voucher_code", length = 100)
    private String voucherCode;

    @OneToMany(mappedBy = "vouchers")
    private List<Orders> orders;

    @Column(name = "discount_type", length = 10)
    private String discountType;

    @Column(name = "discount_value")
    private float discountValue;

    @Column(name = "max_discount")
    private float maxDiscount;

    @Column(name = "valid_from")
    private Timestamp validFrom;

    @Column(name = "valid_to")
    private Timestamp validTo;

    @Column(name = "used_count")
    private int usedCount;
}
