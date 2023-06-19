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
    @Column(name = "voucher_code")
    private int voucherCode;

    @OneToMany(mappedBy = "vouchers")
    private List<OrderItems> orderItems;

    @Column(name = "voucher_type")
    private int voucherType;

    @Column(name = "discount_type")
    private int discountType;

    @Column(name = "max_discount")
    private float maxDiscount;

    @Column(name = "valid_from")
    private Timestamp validFrom;

    @Column(name = "valid_to")
    private Timestamp validTo;

    @Column(name = "used_count")
    private int usedCount;
}
